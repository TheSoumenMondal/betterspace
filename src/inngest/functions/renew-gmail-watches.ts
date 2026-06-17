import { eq } from "drizzle-orm";
import { registerGmailWatch } from "@/lib/gmail";
import { db } from "@/server/db";
import { corsairAccounts, corsairIntegrations } from "@/server/db/schema";
import { inngest } from "../client";

export const renewGmailWatches = inngest.createFunction(
	{
		id: "renew-gmail-watches",
		triggers: [{ cron: "0 0 * * *" }],
	},
	async ({ step }) => {
		const accounts = await step.run("fetch-gmail-accounts", async () => {
			return await db
				.select({ tenantId: corsairAccounts.tenantId })
				.from(corsairAccounts)
				.innerJoin(
					corsairIntegrations,
					eq(corsairAccounts.integrationId, corsairIntegrations.id),
				)
				.where(eq(corsairIntegrations.name, "gmail"));
		});

		const results = await step.run("renew-watches", async () => {
			const status = { success: 0, failed: 0, errors: [] as string[] };

			for (const { tenantId } of accounts) {
				try {
					await registerGmailWatch(tenantId);
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

		return { message: "Renewed all Gmail watches", results };
	},
);
