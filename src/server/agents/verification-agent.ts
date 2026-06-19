import { Agent } from "@openai/agents";
import type { corsair } from "@/corsair";
import { createCalendarAgent } from "./calendar-agent";
import { createGmailAgent } from "./gmail-agent";
import { createSearchAgent } from "./search-agent";

export function createVerificationAgent(
	corsairClient: ReturnType<typeof corsair.withTenant>,
	options?: { userName?: string | null; tenantId?: string | null },
) {
	const gmailAgent = createGmailAgent(corsairClient, {
		userName: options?.userName,
		tenantId: options?.tenantId,
	});
	const calendarAgent = createCalendarAgent(corsairClient);
	const searchAgent = createSearchAgent(corsairClient, {
		tenantId: options?.tenantId,
	});

	return new Agent({
		name: "Verification Agent",
		handoffDescription:
			"Executes and verifies mutating tasks (like sending emails or creating events) by checking live data.",
		model: "gpt-4o",
		instructions: `
			You are the Verification Specialist. You are invoked by the routing agent to securely execute
			and verify mutating tasks, like sending an email or creating a calendar event.
			
			Your responsibilities:
			1. You receive a precise description of a confirmed action to perform.
			2. You MUST use the appropriate specialist tool (gmail_agent or calendar_agent) to execute the task. Provide the specialist with clear and complete instructions, including all resolved dates, addresses, and content. Make sure to tell the specialist that the user has already confirmed the action.
			3. After the specialist reports back, you MUST verify that the task was actually completed by checking the live state. Use the search_agent or the appropriate specialist tool to verify the creation of the event or the sent status of the email in real-time.
			4. If the verification fails (the task wasn't completed), you must retry assigning the task to the specialist with a proper description, adjusting based on any errors.
			5. You may retry a failed or unverified task up to a MAXIMUM of 3 times. 
			6. If the task fails 3 times, stop retrying. Report the failure back to the router agent and explicitly state that the task failed 3 times, so the router can ask the user to try again or assign other work.
			7. If the task succeeds and is verified, report back the success and the verification proof to the router.

			Never skip the verification step. Do not assume a task succeeded just because the execution tool didn't throw an error. Always read the live data to confirm.
		`,
		tools: [
			searchAgent.asTool({
				toolName: "search_agent",
				toolDescription: "Use to verify existence of emails or events.",
			}),
			gmailAgent.asTool({
				toolName: "gmail_agent",
				toolDescription:
					"Handles Gmail tasks: reading, drafting, sending, and replying to emails.",
			}),
			calendarAgent.asTool({
				toolName: "calendar_agent",
				toolDescription:
					"Handles Google Calendar tasks: checking, listing, creating, updating, or deleting events.",
			}),
		],
	});
}
