import { and, eq, gte, lt, sql } from "drizzle-orm";
import type { z } from "zod";
import {
	calendarEventMetadata,
	corsairAccounts,
	corsairIntegrations,
} from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type calendarEventSchema, getEventsInputModel } from "./model";

type CalendarEventItem = z.infer<typeof calendarEventSchema>;

async function getCalendarAccountId(
	db: typeof import("@/server/db").db,
	userId: string,
): Promise<string | null> {
	const [account] = await db
		.select({ id: corsairAccounts.id })
		.from(corsairAccounts)
		.innerJoin(
			corsairIntegrations,
			eq(corsairAccounts.integrationId, corsairIntegrations.id),
		)
		.where(
			and(
				eq(corsairAccounts.tenantId, userId),
				eq(corsairIntegrations.name, "googlecalendar"),
			),
		)
		.limit(1);
	return account?.id ?? null;
}

export const calendarRoute = createTRPCRouter({
	getEvents: protectedProcedure
		.input(getEventsInputModel)
		.query(async ({ ctx, input }) => {
			const { session } = ctx;

			const accountId = await getCalendarAccountId(ctx.db, session.user.id);
			if (!accountId) {
				return { items: [], nextPageToken: null, timeZone: undefined };
			}

			const conditions = [eq(calendarEventMetadata.accountId, accountId)];

			if (input?.timeMin) {
				conditions.push(
					gte(calendarEventMetadata.startAt, new Date(input.timeMin)),
				);
			}

			if (input?.timeMax) {
				conditions.push(
					lt(calendarEventMetadata.startAt, new Date(input.timeMax)),
				);
			}

			if (input?.q) {
				const term = `%${input.q}%`;
				conditions.push(
					sql`(
            ${calendarEventMetadata.summary} ILIKE ${term}
            OR ${calendarEventMetadata.description} ILIKE ${term}
          )`,
				);
			}

			const maxResults = input?.maxResults ?? 50;

			const rows = await ctx.db
				.select({ data: calendarEventMetadata.rawEvent })
				.from(calendarEventMetadata)
				.where(and(...conditions))
				.orderBy(calendarEventMetadata.startAt)
				.limit(maxResults);

			return {
				items: rows.map((r) => r.data as CalendarEventItem),
				nextPageToken: null,
				timeZone: undefined,
			};
		}),
});
