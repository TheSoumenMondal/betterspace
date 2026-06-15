import { corsair } from "./src/corsair";
import { createCorsairTools } from "./src/server/agents/tools";

const client = corsair.withTenant("dummy");
const tools = createCorsairTools(client);

console.log("Tools provided by MCP:");
for (const t of tools) {
	console.log(`- ${t.name}: ${t.description}`);
}
