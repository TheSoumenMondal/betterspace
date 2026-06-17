import "dotenv/config";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";
import { createCorsair } from "corsair";
import { Pool } from "pg";

import { env } from "./env";
import { inngest } from "./inngest/client";
import { db } from "./server/db";

const pool = new Pool({ connectionString: env.DATABASE_URL });

const corsair = createCorsair({
	kek: env.CORSAIR_KEK,
	database: pool,
	multiTenancy: true,
	plugins: [
		gmail({
			authType: "oauth_2",
			defaultIntegrationConfig: {
				topic_id: env.GOOGLE_PUBSUB_TOPIC_ID,
			},
			webhookHooks: {
				messageChanged: {
					after: async (ctx, event) => {
						// @ts-expect-error event structure might differ based on corsair version
						const payload = event.data || event.payload || event;
						if (payload?.type === "messageReceived") {
							const userId = ctx.tenantId;
							if (!userId) return;

							const integration = await db.query.corsairIntegrations.findFirst({
								where: (table, { eq }) => eq(table.name, "gmail"),
							});

							if (!integration) return;

							const account = await db.query.corsairAccounts.findFirst({
								where: (table, { eq, and }) =>
									and(
										eq(table.tenantId, userId),
										eq(table.integrationId, integration.id),
									),
							});

							if (account && payload.message?.id) {
								await inngest.send({
									name: "sync/gmail.message.received",
									data: {
										userId: userId,
										accountId: account.id,
										messageId: payload.message.id,
									},
								});
							}
						}
					},
				},
			},
		}),
		googlecalendar({
			authType: "oauth_2",
			defaultIntegrationConfig: {
				topic_id: env.GOOGLE_PUBSUB_TOPIC_ID,
			},
			webhookHooks: {
				onEventChanged: {
					after: async (ctx, event) => {
						// @ts-expect-error event structure might differ based on corsair version
						const payload = event.data || event.payload || event;

						const userId = ctx.tenantId;
						if (!userId) return;

						const integration = await db.query.corsairIntegrations.findFirst({
							where: (table, { eq }) => eq(table.name, "googlecalendar"),
						});

						if (!integration) return;

						const account = await db.query.corsairAccounts.findFirst({
							where: (table, { eq, and }) =>
								and(
									eq(table.tenantId, userId),
									eq(table.integrationId, integration.id),
								),
						});

						if (account && payload.type) {
							await inngest.send({
								name: "sync/calendar.event.received",
								data: {
									userId,
									accountId: account.id,
									calendarId: payload.calendarId,
									eventType: payload.type,
									calendarEvent: payload.event,
									eventId: payload.eventId,
								},
							});
						}
					},
				},
			},
		}),
	],
});

export { corsair };
