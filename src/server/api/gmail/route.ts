import { and, asc, desc, eq, inArray, type SQL, sql } from "drizzle-orm";
import { corsair } from "@/corsair";
import {
	corsairAccounts,
	corsairEntities,
	emailAiMetadata,
	user,
} from "@/server/db/schema";
import { buildGmailRawMessage } from "@/server/gmail/mime";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
	createDraftMailInput,
	createDraftMailOutput,
	getAllMailsInput,
	getAllMailsOutput,
	searchMailsInput,
	searchMailsOutput,
} from "./model";

const tags = ["gmail"];

export const gmailRoute = createTRPCRouter({
	createDraft: protectedProcedure
		.meta({
			path: "gmail-createDraft",
			tags: tags,
			protectedProcedure: true,
		})
		.input(createDraftMailInput)
		.output(createDraftMailOutput)
		.mutation(async ({ ctx, input }) => {
			const { sender, to, cc, bcc, subject, body } = input;
			const raw = buildGmailRawMessage({
				from: sender,
				to,
				cc,
				bcc,
				subject,
				body,
				isHtml: true,
			});

			const gmailClient = corsair.withTenant(ctx.session.user.id);
			const result = await gmailClient.gmail.api.drafts.create({
				userId: "me",
				draft: {
					message: {
						raw,
					},
				},
			});

			return {
				draftId: result.id ?? "",
				messageId: result.message?.id ?? "",
				threadId: result.message?.threadId ?? "",
				createdAt: new Date().toISOString(),
			};
		}),
	getAllMails: protectedProcedure
		.input(getAllMailsInput)
		.output(getAllMailsOutput)
		.query(async ({ ctx, input }) => {
			const {
				limit,
				cursor,
				labelId,
				sort,
				importance,
				hasMeetingSignal,
				hasDeadline,
				hasInvoice,
				hasAttachment,
			} = input;
			const offset = cursor ?? 0;

			const accounts = await ctx.db
				.select()
				.from(corsairAccounts)
				.where(eq(corsairAccounts.tenantId, ctx.session.user.id));

			if (accounts.length === 0) {
				return { items: [], nextCursor: null };
			}
			const accountIds = accounts.map((a) => a.id);

			const [currentUser] = await ctx.db
				.select()
				.from(user)
				.where(eq(user.id, ctx.session.user.id));

			const syncLimit = currentUser?.plan === "free" ? 100 : 500;

			if (labelId && labelId !== "INBOX") {
				const existingCount = await ctx.db
					.select({ count: sql`count(*)` })
					.from(corsairEntities)
					.where(
						and(
							inArray(corsairEntities.accountId, accountIds),
							eq(corsairEntities.entityType, "messages"),
							sql`${corsairEntities.data}->'labelIds' @> ${JSON.stringify([labelId])}::jsonb`,
						),
					);

				const count = Number(existingCount[0]?.count || 0);

				if (count === 0) {
					const gmailClient = corsair.withTenant(ctx.session.user.id);
					const response = await gmailClient.gmail.api.messages.list({
						userId: "me",
						labelIds: [labelId],
						maxResults: syncLimit,
					});

					if (response.messages && response.messages.length > 0) {
						const accountId = accountIds[0];
						if (!accountId) {
							return { items: [], nextCursor: null };
						}

						const validResponseMessages = response.messages.filter(
							(m): m is { id: string } => typeof m.id === "string",
						);

						const rawMessages = await Promise.all(
							validResponseMessages.map((m) =>
								gmailClient.gmail.api.messages.get({
									userId: "me",
									id: m.id,
								}),
							),
						);

						const validMessages = rawMessages.filter(
							(m): m is typeof m & { id: string } => typeof m.id === "string",
						);

						const messages = Array.from(
							new Map(validMessages.map((m) => [m.id, m])).values(),
						);

						const fetchedEntityIds = messages.map((m) => m.id);
						const existingRows = await ctx.db
							.select({
								id: corsairEntities.id,
								entityId: corsairEntities.entityId,
							})
							.from(corsairEntities)
							.where(inArray(corsairEntities.entityId, fetchedEntityIds));

						const existingIdMap = new Map(
							existingRows.map((r) => [r.entityId, r.id]),
						);

						const entitiesToInsert: {
							id: string;
							accountId: string;
							entityId: string;
							entityType: string;
							version: string;
							data: unknown;
						}[] = [];

						const entitiesToUpdate: {
							id: string;
							data: unknown;
						}[] = [];

						for (const msg of messages) {
							const existingId = existingIdMap.get(msg.id);
							if (existingId) {
								entitiesToUpdate.push({
									id: existingId,
									data: msg,
								});
							} else {
								entitiesToInsert.push({
									id: `msg_${msg.id}`,
									accountId,
									entityId: msg.id,
									entityType: "messages",
									version: "1",
									data: msg,
								});
							}
						}

						if (entitiesToInsert.length > 0) {
							await ctx.db
								.insert(corsairEntities)
								.values(entitiesToInsert)
								.onConflictDoNothing();
						}

						for (const update of entitiesToUpdate) {
							await ctx.db
								.update(corsairEntities)
								.set({ data: update.data })
								.where(eq(corsairEntities.id, update.id));
						}
					}
				}
			}

			const conditions = [
				inArray(corsairEntities.accountId, accountIds),
				eq(corsairEntities.entityType, "messages"),
				labelId
					? sql`${corsairEntities.data}->'labelIds' @> ${JSON.stringify([labelId])}::jsonb`
					: undefined,
			];

			if (importance && importance.length > 0) {
				conditions.push(inArray(emailAiMetadata.importance, importance));
			}
			if (hasMeetingSignal) {
				conditions.push(eq(emailAiMetadata.hasMeetingSignal, true));
			}
			if (hasDeadline) {
				conditions.push(eq(emailAiMetadata.hasDeadline, true));
			}
			if (hasInvoice) {
				conditions.push(eq(emailAiMetadata.hasInvoice, true));
			}
			if (hasAttachment) {
				conditions.push(eq(emailAiMetadata.hasAttachment, true));
			}

			let orderByClause: SQL<unknown>;
			if (sort === "priorityDesc") {
				orderByClause = desc(emailAiMetadata.priorityScore);
			} else if (sort === "priorityAsc") {
				orderByClause = asc(emailAiMetadata.priorityScore);
			} else if (sort === "oldest") {
				orderByClause = asc(sql`${corsairEntities.data}->>'internalDate'`);
			} else {
				orderByClause = desc(sql`${corsairEntities.data}->>'internalDate'`);
			}

			const query = ctx.db
				.select({
					raw: corsairEntities.data,
					aiMetadata: emailAiMetadata,
				})
				.from(corsairEntities)
				.leftJoin(
					emailAiMetadata,
					eq(corsairEntities.entityId, emailAiMetadata.emailId),
				)
				.where(and(...conditions))
				.orderBy(orderByClause)
				.limit(limit + 1)
				.offset(offset);

			const messages = await query;
			let nextCursor: typeof cursor = null;
			if (messages.length > limit) {
				messages.pop();
				nextCursor = offset + limit;
			}

			return {
				items: messages.map((m) => ({
					...(m.raw as Record<string, unknown>),
					aiMetadata: m.aiMetadata,
				})),
				nextCursor,
			};
		}),

	searchMails: protectedProcedure
		.input(searchMailsInput)
		.output(searchMailsOutput)
		.query(async ({ ctx, input }) => {
			const { query, limit, cursor } = input;

			const gmailClient = corsair.withTenant(ctx.session.user.id);

			const response = await gmailClient.gmail.api.messages.list({
				userId: "me",
				q: query,
				maxResults: limit,
				pageToken: cursor ?? undefined,
			});

			if (!response.messages || response.messages.length === 0) {
				return { items: [], nextCursor: null };
			}

			const messageDetails = await Promise.all(
				response.messages.map(async (msg) => {
					try {
						return await gmailClient.gmail.api.messages.get({
							userId: "me",
							id: msg.id as string,
							format: "full",
						});
					} catch (_err) {
						return null;
					}
				}),
			);

			const validMessages = messageDetails.filter((m) => m !== null);

			return {
				items: validMessages,
				nextCursor: response.nextPageToken ?? null,
			};
		}),
});
