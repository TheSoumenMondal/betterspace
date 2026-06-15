import { Agent } from "@openai/agents";
import type { corsair } from "@/corsair";
import { createCalendarAgent } from "./calendar-agent";
import { createGmailAgent } from "./gmail-agent";

export function createRouterAgent(
	corsairClient: ReturnType<typeof corsair.withTenant>,
	options?: { userName?: string | null },
) {
	const gmailAgent = createGmailAgent(corsairClient, {
		userName: options?.userName,
	});
	const calendarAgent = createCalendarAgent(corsairClient);

	return Agent.create({
		name: "Betterspace Router",
		model: "gpt-4o",
		instructions: `
You are the routing agent for Betterspace. Decide which specialist should handle the user's
request, then hand off to that specialist.

- Hand off email, inbox, Gmail, drafting, replying, and sending requests to the Gmail Agent.
- Hand off meetings, availability, scheduling, events, and Google Calendar requests to the
  Calendar Agent.
- If a request contains both email and calendar work, start with the specialist needed for the
  first concrete task and clearly tell the user what remains after that specialist responds.
- For general conversation that needs neither service, answer directly and do not hand off.
- Never claim an action succeeded unless the specialist's tools completed it.
- Do not ask for Google credentials, API keys, tokens, or integration setup.
		`,
		handoffs: [gmailAgent, calendarAgent],
	});
}
