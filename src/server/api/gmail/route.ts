import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { corsair } from "@/corsair";
import { corsairAccounts, corsairEntities } from "@/server/db/schema";
import { buildGmailRawMessage } from "@/server/gmail/mime";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
	createDraftMailInput,
	createDraftMailOutput,
	getAllMailsInput,
	getAllMailsOutput,
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
			const { limit, cursor, labelId } = input;
			const offset = cursor ?? 0;

			const accounts = await ctx.db
				.select()
				.from(corsairAccounts)
				.where(eq(corsairAccounts.tenantId, ctx.session.user.id));

			if (accounts.length === 0) {
				return { items: [], nextCursor: null };
			}
			const accountIds = accounts.map((a) => a.id);

			const query = ctx.db
				.select()
				.from(corsairEntities)
				.where(
					and(
						inArray(corsairEntities.accountId, accountIds),
						eq(corsairEntities.entityType, "messages"),
						labelId
							? sql`${corsairEntities.data}->'labelIds' @> ${JSON.stringify([labelId])}::jsonb`
							: undefined,
					),
				)
				.orderBy(desc(sql`${corsairEntities.data}->>'internalDate'`))
				.limit(limit + 1)
				.offset(offset);

			const messages = await query;
			let nextCursor: typeof cursor = null;
			if (messages.length > limit) {
				messages.pop();
				nextCursor = offset + limit;
			}

			return {
				items: messages.map((m) => m.data),
				nextCursor,
			};
		}),
});
