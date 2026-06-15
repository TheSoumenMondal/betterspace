import { Agent } from "@openai/agents";
import type { corsair } from "@/corsair";
import { createCorsairTools } from "./tools";

export function createCalendarAgent(
	corsairClient: ReturnType<typeof corsair.withTenant>,
) {
	const now = new Date();
	const formatter = new Intl.DateTimeFormat("en-US", {
		dateStyle: "full",
		timeStyle: "long",
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	});

	return new Agent({
		name: "Calendar Agent",
		handoffDescription:
			"Handles Google Calendar tasks such as checking availability and listing, creating, updating, or deleting events.",
		model: "gpt-4o",
		instructions: `
			You are the Google Calendar specialist.
			The current date and time is ${formatter.format(now)}.
			The user has already connected Google Calendar. Never ask for credentials, tokens, API keys, or
			setup. Only handle calendar, meeting, scheduling, and availability requests.

			Use the \`run_script\` tool provided by Corsair to inspect and manage Google Calendar (e.g. corsair.googlecalendar.api.events.list).
			You can write JS scripts to map, reduce, or format data from Corsair API calls.
			Use \`list_operations\` and \`get_schema\` before writing scripts for unfamiliar operations. Respect the user's timezone and ask a concise clarification when a
			date, time, duration, timezone, calendar, or attendee is ambiguous.

			Never create, update, delete, or invite attendees to an event unless the user explicitly confirmed
			that exact action in the conversation. Reading calendars and checking availability do not require
			confirmation.
		`,
		tools: createCorsairTools(corsairClient),
	});
}
