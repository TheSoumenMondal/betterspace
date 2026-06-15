import { OpenAIAgentsProvider } from "@corsair-dev/mcp";
import { tool } from "@openai/agents";
import type { corsair } from "@/corsair";

export function createCorsairTools(
	corsairClient: ReturnType<typeof corsair.withTenant>,
) {
	const provider = new OpenAIAgentsProvider();

	return provider.build({
		corsair: corsairClient,
		tool,
	});
}
