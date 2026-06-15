import { desc } from "drizzle-orm";
import { db } from "./src/server/db";
import { messages } from "./src/server/db/schema";

async function test() {
	const msgs = await db
		.select()
		.from(messages)
		.orderBy(desc(messages.createdAt))
		.limit(10);

	for (const msg of msgs.reverse()) {
		console.log(`[${msg.role}] ${msg.content}`);
	}
	process.exit(0);
}

test().catch(console.error);
