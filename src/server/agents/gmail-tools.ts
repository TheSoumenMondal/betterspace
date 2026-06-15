import { tool } from "@openai/agents";
import { z } from "zod";
import type { corsair } from "@/corsair";
import { buildGmailRawMessage } from "@/server/gmail/mime";

const emailMessageInput = z.object({
	to: z.array(z.string()).min(1).describe("Recipient email addresses."),
	cc: z.array(z.string()).optional().describe("CC recipient email addresses."),
	bcc: z
		.array(z.string())
		.optional()
		.describe("BCC recipient email addresses."),
	subject: z.string().min(1).describe("Email subject."),
	body: z.string().min(1).describe("Email body."),
	isHtml: z
		.boolean()
		.optional()
		.describe("Set true only when the body is HTML. Defaults to plain text."),
	threadId: z
		.string()
		.optional()
		.describe("Existing Gmail thread id when replying in a thread."),
});

export function createGmailActionTools(
	corsairClient: ReturnType<typeof corsair.withTenant>,
) {
	return [
		tool({
			name: "send_email",
			description:
				"Send an email through the connected Gmail account. Use this after the user explicitly confirms sending.",
			parameters: emailMessageInput,
			execute: async (input) => {
				const raw = buildGmailRawMessage(input);
				const result = await corsairClient.gmail.api.messages.send({
					userId: "me",
					raw,
					threadId: input.threadId,
				});

				return {
					messageId: result.id ?? "",
					threadId: result.threadId ?? input.threadId ?? "",
					labelIds: result.labelIds ?? [],
				};
			},
		}),
		tool({
			name: "create_email_draft",
			description:
				"Create a Gmail draft from structured fields. Use this when the user asks to draft but has not confirmed sending.",
			parameters: emailMessageInput,
			execute: async (input) => {
				const raw = buildGmailRawMessage(input);
				const result = await corsairClient.gmail.api.drafts.create({
					userId: "me",
					draft: {
						message: {
							raw,
							threadId: input.threadId,
						},
					},
				});

				return {
					draftId: result.id ?? "",
					messageId: result.message?.id ?? "",
					threadId: result.message?.threadId ?? input.threadId ?? "",
				};
			},
		}),
	];
}
