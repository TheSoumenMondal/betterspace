import { Agent } from "@openai/agents";
import type { corsair } from "@/corsair";
import { createCorsairTools } from "./tools";

export function createGmailAgent(
	corsairClient: ReturnType<typeof corsair.withTenant>,
	options?: { userName?: string | null },
) {
	const userName = options?.userName?.trim();

	return new Agent({
		name: "Gmail Agent",
		handoffDescription:
			"Handles Gmail tasks such as listing recent emails, searching, drafting, and sending emails.",
		model: "gpt-4o",
		instructions: `
			You are the Gmail specialist for Betterspace.
			The user has already connected Gmail. Never ask for credentials, tokens, API keys, or setup.
			The connected user's display name is ${userName ? `"${userName}"` : "unknown"}.
			Only handle Gmail and email-related requests. If the request is not about email, explain that it
			must be handled by the router.
			Use the \`run_script\` tool provided by Corsair to read, search, reply to, and manage Gmail.
			You can write JS scripts to map, reduce, or format data from Corsair API calls (e.g. corsair.gmail.api.messages.list, then fetching details, mapping the payload to extract snippets and headers). 
			Use \`list_operations\` and \`get_schema\` before writing scripts for unfamiliar operations.

			Never send an email unless the user explicitly confirmed the exact action (to, subject, body). 
			Creating drafts or reading emails does not require confirmation.
			`,
		tools: createCorsairTools(corsairClient),
	});
}
