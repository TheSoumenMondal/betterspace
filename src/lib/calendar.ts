import * as crypto from "node:crypto";
import { corsair } from "@/corsair";
import { env } from "@/env";

export async function registerCalendarWatch(
	tenantId: string,
	calendarId: string = "primary",
) {
	if (!env.APP_URL) {
		throw new Error("APP_URL is missing in environment variables.");
	}

	const c = corsair.withTenant(tenantId).googlecalendar;
	await c.api.events.getMany({ calendarId, maxResults: 1 });

	const token = await c.keys.get_access_token();
	if (!token) throw new Error("No access token could be retrieved.");

	const channelId = crypto.randomUUID();
	const webhookUrl = `${env.APP_URL}/api/webhooks?tenantId=${tenantId}`;

	const res = await fetch(
		`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/watch`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: channelId,
				type: "web_hook",
				address: webhookUrl,
			}),
		},
	);

	if (!res.ok) {
		throw new Error(`Calendar Watch API failed: ${await res.text()}`);
	}

	const data = await res.json();
	return {
		channelId,
		resourceId: data.resourceId,
		expiration: data.expiration,
	};
}
