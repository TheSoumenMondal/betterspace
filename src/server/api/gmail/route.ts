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
	archiveMailInput,
	archiveMailOutput,
	createDraftMailInput,
	createDraftMailOutput,
	getAllMailsInput,
	getAllMailsOutput,
	getUnreadCountOutput,
	markAsReadInput,
	markAsReadOutput,
	searchMailsInput,
	searchMailsOutput,
	sendMailInput,
	sendMailOutput,
	toggleStarInput,
	toggleStarOutput,
	trashMailInput,
	trashMailOutput,
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

	/**
	 * Send an email immediately via Gmail.
	 *
	 * This is the UI compose-form path. It builds the RFC 2822 raw message
	 * server-side (correct base64url via buildGmailRawMessage) and calls
	 * corsair.gmail.api.messages.send directly — the same strategy as the
	 * agent's send_email_fallback tool.
	 *
	 * The MCP / agent path (run_script) is the primary path inside the chat
	 * agent. This mutation exists for the compose UI and as a reliable
	 * fallback reference.
	 */
	sendMail: protectedProcedure
		.meta({
			path: "gmail-sendMail",
			tags,
			protectedProcedure: true,
		})
		.input(sendMailInput)
		.output(sendMailOutput)
		.mutation(async ({ ctx, input }) => {
			const { sender, to, cc, bcc, subject, body, isHtml, threadId } = input;
			const raw = buildGmailRawMessage({
				from: sender,
				to,
				cc,
				bcc,
				subject,
				body,
				isHtml: isHtml ?? false,
				threadId,
			});

			const gmailClient = corsair.withTenant(ctx.session.user.id);
			const result = await gmailClient.gmail.api.messages.send({
				userId: "me",
				raw,
				...(threadId ? { threadId } : {}),
			});

			return {
				messageId: result.id ?? "",
				threadId: result.threadId ?? "",
			};
		}),
	toggleStar: protectedProcedure
		.meta({
			path: "gmail-toggleStar",
			tags,
			protectedProcedure: true,
		})
		.input(toggleStarInput)
		.output(toggleStarOutput)
		.mutation(async ({ ctx, input }) => {
			const { messageId, starred } = input;
			const gmailClient = corsair.withTenant(ctx.session.user.id);

			await gmailClient.gmail.api.messages.modify({
				userId: "me",
				id: messageId,
				addLabelIds: starred ? ["STARRED"] : [],
				removeLabelIds: starred ? [] : ["STARRED"],
			});

			const entityResult = await ctx.db
				.select()
				.from(corsairEntities)
				.where(
					and(
						eq(corsairEntities.entityId, messageId),
						eq(corsairEntities.entityType, "messages"),
					),
				)
				.limit(1);

			if (entityResult.length > 0 && entityResult[0]) {
				const entity = entityResult[0];
				const data = entity.data as Record<string, unknown>;
				let labelIds = (data.labelIds as string[]) || [];

				if (starred && !labelIds.includes("STARRED")) {
					labelIds.push("STARRED");
				} else if (!starred && labelIds.includes("STARRED")) {
					labelIds = labelIds.filter((id) => id !== "STARRED");
				}

				await ctx.db
					.update(corsairEntities)
					.set({ data: { ...data, labelIds } })
					.where(eq(corsairEntities.id, entity.id));
			}

			return { success: true };
		}),
	trashMail: protectedProcedure
		.meta({
			path: "gmail-trashMail",
			tags,
			protectedProcedure: true,
		})
		.input(trashMailInput)
		.output(trashMailOutput)
		.mutation(async ({ ctx, input }) => {
			const { messageId } = input;
			const gmailClient = corsair.withTenant(ctx.session.user.id);

			await gmailClient.gmail.api.messages.trash({
				userId: "me",
				id: messageId,
			});

			const entityResult = await ctx.db
				.select()
				.from(corsairEntities)
				.where(
					and(
						eq(corsairEntities.entityId, messageId),
						eq(corsairEntities.entityType, "messages"),
					),
				)
				.limit(1);

			if (entityResult.length > 0 && entityResult[0]) {
				const entity = entityResult[0];
				const data = entity.data as Record<string, unknown>;
				let labelIds = (data.labelIds as string[]) || [];

				labelIds = labelIds.filter((id) => id !== "INBOX");
				if (!labelIds.includes("TRASH")) {
					labelIds.push("TRASH");
				}

				await ctx.db
					.update(corsairEntities)
					.set({ data: { ...data, labelIds } })
					.where(eq(corsairEntities.id, entity.id));
			}

			return { success: true };
		}),
	archiveMail: protectedProcedure
		.meta({
			path: "gmail-archiveMail",
			tags,
			protectedProcedure: true,
		})
		.input(archiveMailInput)
		.output(archiveMailOutput)
		.mutation(async ({ ctx, input }) => {
			const { messageId } = input;
			const gmailClient = corsair.withTenant(ctx.session.user.id);

			await gmailClient.gmail.api.messages.modify({
				userId: "me",
				id: messageId,
				removeLabelIds: ["INBOX"],
			});

			const entityResult = await ctx.db
				.select()
				.from(corsairEntities)
				.where(
					and(
						eq(corsairEntities.entityId, messageId),
						eq(corsairEntities.entityType, "messages"),
					),
				)
				.limit(1);

			if (entityResult.length > 0 && entityResult[0]) {
				const entity = entityResult[0];
				const data = entity.data as Record<string, unknown>;
				const labelIds = ((data.labelIds as string[]) || []).filter(
					(id) => id !== "INBOX",
				);

				await ctx.db
					.update(corsairEntities)
					.set({ data: { ...data, labelIds } })
					.where(eq(corsairEntities.id, entity.id));
			}

			return { success: true };
		}),

	markAsRead: protectedProcedure
		.meta({
			path: "gmail-markAsRead",
			tags,
			protectedProcedure: true,
		})
		.input(markAsReadInput)
		.output(markAsReadOutput)
		.mutation(async ({ ctx, input }) => {
			const { messageId } = input;
			const gmailClient = corsair.withTenant(ctx.session.user.id);

			await gmailClient.gmail.api.messages.modify({
				userId: "me",
				id: messageId,
				removeLabelIds: ["UNREAD"],
			});

			const entityResult = await ctx.db
				.select()
				.from(corsairEntities)
				.where(
					and(
						eq(corsairEntities.entityId, messageId),
						eq(corsairEntities.entityType, "messages"),
					),
				)
				.limit(1);

			if (entityResult.length > 0 && entityResult[0]) {
				const entity = entityResult[0];
				const data = entity.data as Record<string, unknown>;
				const labelIds = ((data.labelIds as string[]) || []).filter(
					(id) => id !== "UNREAD",
				);

				await ctx.db
					.update(corsairEntities)
					.set({ data: { ...data, labelIds } })
					.where(eq(corsairEntities.id, entity.id));
			}

			return { success: true };
		}),

	getUnreadCount: protectedProcedure
		.meta({
			path: "gmail-getUnreadCount",
			tags,
			protectedProcedure: true,
		})
		.output(getUnreadCountOutput)
		.query(async ({ ctx }) => {
			const accounts = await ctx.db
				.select()
				.from(corsairAccounts)
				.where(eq(corsairAccounts.tenantId, ctx.session.user.id));

			if (accounts.length === 0) {
				return { count: 0 };
			}

			const accountIds = accounts.map((a) => a.id);

			try {
				const result = await ctx.db
					.select({ count: sql`count(*)` })
					.from(corsairEntities)
					.where(
						and(
							inArray(corsairEntities.accountId, accountIds),
							eq(corsairEntities.entityType, "messages"),
							sql`${corsairEntities.data}->'labelIds' @> ${JSON.stringify(["INBOX", "UNREAD"])}::jsonb`,
						),
					);

				return { count: Number(result[0]?.count || 0) };
			} catch (error) {
				console.error("Failed to fetch unread count from database", error);
				return { count: 0 };
			}
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
				isUnread,
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
			if (isUnread !== undefined) {
				if (isUnread) {
					conditions.push(
						sql`${corsairEntities.data}->'labelIds' @> ${JSON.stringify(["UNREAD"])}::jsonb`,
					);
				} else {
					conditions.push(
						sql`NOT (${corsairEntities.data}->'labelIds' @> ${JSON.stringify(["UNREAD"])}::jsonb)`,
					);
				}
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
