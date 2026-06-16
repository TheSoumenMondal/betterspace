import { OpenAIAgentsProvider } from "@corsair-dev/mcp";
import { tool } from "@openai/agents";
import { z } from "zod";
import type { corsair } from "@/corsair";
import { buildGmailRawMessage } from "@/server/gmail/mime";

export function createCorsairTools(
	corsairClient: ReturnType<typeof corsair.withTenant>,
) {
	const provider = new OpenAIAgentsProvider();

	return provider.build({
		corsair: corsairClient,
		tool,
	});
}

/**
 * A native @openai/agents tool that sends an email directly via the Corsair
 * SDK (server-side). Used as a fallback when the MCP `run_script` path fails
 * (e.g. encoding errors, API quota, timeouts).
 *
 * The LLM fills structured fields (to, subject, body…) — no raw base64 involved.
 * `buildGmailRawMessage` handles correct base64url encoding server-side.
 */
export function createSendFallbackTool(
	corsairClient: ReturnType<typeof corsair.withTenant>,
) {
	return tool({
		name: "send_email_fallback",
		description:
			"Fallback tool to send an email via Gmail when the primary run_script approach fails. " +
			"Provide structured fields — do NOT pass raw base64 strings. " +
			"Only call this after a run_script send attempt has returned an error.",
		parameters: z.object({
			to: z
				.array(z.string().email())
				.min(1)
				.describe("Recipient email addresses"),
			cc: z.array(z.string().email()).optional().describe("CC email addresses"),
			bcc: z
				.array(z.string().email())
				.optional()
				.describe("BCC email addresses"),
			subject: z.string().min(1).describe("Email subject line"),
			body: z
				.string()
				.min(1)
				.describe("Email body content (plain text or HTML)"),
			isHtml: z
				.boolean()
				.optional()
				.default(false)
				.describe("Set true if body contains HTML markup"),
			threadId: z
				.string()
				.optional()
				.describe(
					"Gmail thread ID — only set when replying to an existing thread",
				),
		}),
		execute: async ({ to, cc, bcc, subject, body, isHtml, threadId }) => {
			try {
				const raw = buildGmailRawMessage({
					to,
					cc,
					bcc,
					subject,
					body,
					isHtml: isHtml ?? false,
					threadId,
				});

				const result = await corsairClient.gmail.api.messages.send({
					userId: "me",
					raw,
					...(threadId ? { threadId } : {}),
				});

				return JSON.stringify({
					success: true,
					messageId: result.id ?? "",
					threadId: result.threadId ?? "",
				});
			} catch (error) {
				return JSON.stringify({
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Unknown error sending email",
				});
			}
		},
	});
}
