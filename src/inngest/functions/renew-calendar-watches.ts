import { eq } from "drizzle-orm";
import { registerCalendarWatch } from "@/lib/calendar";
import { db } from "@/server/db";
import { corsairAccounts, corsairIntegrations } from "@/server/db/schema";
import { inngest } from "../client";

export const renewCalendarWatches = inngest.createFunction(
	{
		id: "renew-calendar-watches",
		triggers: [{ cron: "0 0 * * *" }],
	},
	async ({ step }) => {
		const accounts = await step.run("fetch-calendar-accounts", async () => {
			return await db
				.select({ tenantId: corsairAccounts.tenantId })
				.from(corsairAccounts)
				.innerJoin(
					corsairIntegrations,
					eq(corsairAccounts.integrationId, corsairIntegrations.id),
				)
				.where(eq(corsairIntegrations.name, "googlecalendar"));
		});

		const results = await step.run("renew-calendar-watches", async () => {
			const status = { success: 0, failed: 0, errors: [] as string[] };

			for (const { tenantId } of accounts) {
				try {
					await registerCalendarWatch(tenantId);
					status.success++;
				} catch (error) {
					status.failed++;
					status.errors.push(
						`Tenant ${tenantId}: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}

			return status;
		});

		return { message: "Renewed all Google Calendar watches", results };
	},
);
