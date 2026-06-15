import { corsair } from "./src/corsair";
import { db } from "./src/server/db";
import { corsairAccounts } from "./src/server/db/schema";

async function test() {
	const accounts = await db.select().from(corsairAccounts);
	if (!accounts[0]) return;

	const client = corsair.withTenant(accounts[0].tenantId);
	try {
		const listRes = await client.gmail.api.messages.list({
			userId: "me",
			maxResults: 5,
		});
		console.log("List:", listRes.messages);

		if (listRes.messages?.[0]?.id) {
			const getRes = await client.gmail.api.messages.get({
				userId: "me",
				id: listRes.messages[0].id,
				format: "metadata",
				metadataHeaders: ["From", "Subject", "Date"],
			});
			console.log("Get payload:", JSON.stringify(getRes.payload, null, 2));
		}
	} catch (e) {
		console.error(e);
	}
}

test().catch(console.error);
