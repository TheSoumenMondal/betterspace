import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { corsairAccounts, corsairIntegrations, user } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
	checkServiceConnectionStatusInput,
	checkServiceConnectionStatusOutput,
	undefinedSchema,
} from "./model";

const tags = ["ACCOUNT"];

export const accountRouter = createTRPCRouter({
	checkServiceConnectionStatus: protectedProcedure
		.meta({
			path: "/check-status",
			tags: tags,
			protectedProcedure: true,
		})
		.input(checkServiceConnectionStatusInput)
		.output(checkServiceConnectionStatusOutput)
		.query(async ({ ctx, input }) => {
			const { corsairIntegrationName } = input;
			const { session } = ctx;
			const userId = session.user.id;
			const accounts = await db
				.select({ name: corsairIntegrations.name, dek: corsairAccounts.dek })
				.from(corsairAccounts)
				.innerJoin(
					corsairIntegrations,
					eq(corsairAccounts.integrationId, corsairIntegrations.id),
				)
				.where(eq(corsairAccounts.tenantId, userId));

			// An account row is created before token exchange — only count it connected
			// if a dek exists (meaning tokens were actually written and encrypted).
			const connected = new Set(
				accounts.filter((a) => a.dek !== null).map((a) => a.name),
			);
			const serviceConnectionStatus = connected.has(corsairIntegrationName);

			return {
				serviceConnectionStatus: serviceConnectionStatus,
			};
		}),

	updateOnboardingStatus: protectedProcedure
		.meta({
			path: "/update-onboarding-status",
			tags: tags,
			protectedProcedure: true,
		})
		.input(undefinedSchema)
		.output(undefinedSchema)
		.mutation(async ({ ctx }) => {
			const { session } = ctx;
			const userId = session.user.id;
			if (!userId) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
				});
			}
			if (session.user.hasCompletedOnboarding) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Onboarding already completed",
				});
			}
			const accounts = await db
				.select({ name: corsairIntegrations.name, dek: corsairAccounts.dek })
				.from(corsairAccounts)
				.innerJoin(
					corsairIntegrations,
					eq(corsairAccounts.integrationId, corsairIntegrations.id),
				)
				.where(eq(corsairAccounts.tenantId, userId));

			const connected = new Set(
				accounts.filter((a) => a.dek !== null).map((a) => a.name),
			);

			if (!connected.has("gmail") || !connected.has("googlecalendar")) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Please connect all services before completing onboarding",
				});
			}

			await db
				.update(user)
				.set({ hasCompletedOnboarding: true })
				.where(eq(user.id, userId));
		}),
});
