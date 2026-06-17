import { corsair } from "@/corsair";
import { env } from "@/env";

export async function registerGmailWatch(tenantId: string) {
	const topicName = env.GOOGLE_PUBSUB_TOPIC_ID;
	if (!topicName) {
		throw new Error(
			"GOOGLE_PUBSUB_TOPIC_ID is missing in environment variables.",
		);
	}

	const g = corsair.withTenant(tenantId).gmail;

	await g.api.labels.list({});

	const token = await g.keys.get_access_token();
	if (!token) throw new Error("No access token could be retrieved.");

	const res = await fetch(
		"https://gmail.googleapis.com/gmail/v1/users/me/watch",
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				topicName: topicName,
				labelIds: ["INBOX"],
			}),
		},
	);

	if (!res.ok) {
		throw new Error(`Watch API failed: ${await res.text()}`);
	}

	return true;
}
