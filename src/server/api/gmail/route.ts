import { corsair } from "@/corsair";
import { buildGmailRawMessage } from "@/server/gmail/mime";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createDraftMailInput, createDraftMailOutput } from "./model";

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
});
