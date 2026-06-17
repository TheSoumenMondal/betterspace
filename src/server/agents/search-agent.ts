import { Agent } from "@openai/agents";
import type { corsair } from "@/corsair";
import { createCorsairTools } from "./tools";

export function createSearchAgent(
	corsairClient: ReturnType<typeof corsair.withTenant>,
) {
	return new Agent({
		name: "Advanced Search Agent",
		handoffDescription:
			"Handles complex, advanced, or multi-service search queries across Gmail, Calendar, and general Corsair integrations.",
		model: "gpt-4o",
		instructions: `
			You are the Advanced Search specialist. You are invoked by a routing agent as a tool — you do
			not talk to the end user directly and you do not see the full conversation, only the specific
			instruction given to you below. Carry out exactly that instruction and report back a concise,
			factual result with relevant snippets.

			Use the \`run_script\` tool to perform advanced searches (e.g. Corsair search APIs or Gmail
			advanced search parameters). Use \`list_operations\` and \`get_schema\` before writing scripts
			for unfamiliar operations.

			If a search returns many results or multiple plausible matches for what looks like a targeted
			lookup ("the email from John about the contract"), don't pick one arbitrarily — return the
			top few candidates with enough detail (sender, subject, date) for the caller to disambiguate.

			This agent is read-only: it never creates, updates, deletes, or sends anything. If the
			instruction asks for a mutating action, say that it's out of scope for search.

			If the instruction has nothing to do with finding or searching data, reply that you only
			handle search tasks.
		`,
		tools: createCorsairTools(corsairClient),
	});
}
