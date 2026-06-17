import { TRPCError } from "@trpc/server";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import type { z } from "zod";
import { corsair } from "@/corsair";
import {
	calendarEventMetadata,
	corsairAccounts,
	corsairIntegrations,
} from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
	type calendarEventSchema,
	createEventInputModel,
	deleteEventInputModel,
	getEventsInputModel,
	updateEventInputModel,
} from "./model";

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

	createEvent: protectedProcedure
		.input(createEventInputModel)
		.mutation(async ({ ctx, input }) => {
			const { session } = ctx;
			const c = corsair.withTenant(session.user.id).googlecalendar;

			const startObj = input.isAllDay
				? { date: new Date(input.startAt).toISOString().split("T")[0] }
				: {
						dateTime: new Date(input.startAt).toISOString(),
						timeZone: input.timeZone ?? "UTC",
					};

			const endObj = input.isAllDay
				? { date: new Date(input.endAt).toISOString().split("T")[0] }
				: {
						dateTime: new Date(input.endAt).toISOString(),
						timeZone: input.timeZone ?? "UTC",
					};

			const res = await c.api.events.create({
				calendarId: input.calendarId,
				event: {
					summary: input.summary,
					description: input.description,
					location: input.location,
					start: startObj,
					end: endObj,
				},
			});

			return res;
		}),

	updateEvent: protectedProcedure
		.input(updateEventInputModel)
		.mutation(async ({ ctx, input }) => {
			const { session } = ctx;
			const c = corsair.withTenant(session.user.id).googlecalendar;

			try {
				const eventMeta = await ctx.db.query.calendarEventMetadata.findFirst({
					where: eq(calendarEventMetadata.eventId, input.eventId),
					columns: { calendarId: true },
				});

				const actualCalendarId = eventMeta?.calendarId ?? input.calendarId;

				const existingEvent = await c.api.events.get({
					calendarId: actualCalendarId,
					id: input.eventId,
				});

				let startObj = existingEvent.start;
				let endObj = existingEvent.end;

				if (input.startAt && input.endAt && input.isAllDay !== undefined) {
					startObj = input.isAllDay
						? { date: new Date(input.startAt).toISOString().split("T")[0] }
						: {
								dateTime: new Date(input.startAt).toISOString(),
								timeZone:
									input.timeZone ?? existingEvent.start?.timeZone ?? "UTC",
							};

					endObj = input.isAllDay
						? { date: new Date(input.endAt).toISOString().split("T")[0] }
						: {
								dateTime: new Date(input.endAt).toISOString(),
								timeZone:
									input.timeZone ?? existingEvent.end?.timeZone ?? "UTC",
							};
				}

				const res = await c.api.events.update({
					calendarId: actualCalendarId,
					id: input.eventId,
					event: {
						summary: input.summary ?? existingEvent.summary,
						description: input.description ?? existingEvent.description,
						location: input.location ?? existingEvent.location,
						start: startObj,
						end: endObj,
					},
				});

				const startAtStr = res.start?.dateTime ?? res.start?.date;
				const endAtStr = res.end?.dateTime ?? res.end?.date;

				await ctx.db
					.update(calendarEventMetadata)
					.set({
						summary: res.summary,
						description: res.description,
						location: res.location,
						startAt: startAtStr ? new Date(startAtStr) : undefined,
						endAt: endAtStr ? new Date(endAtStr) : undefined,
						allDay: !res.start?.dateTime,
						rawEvent: res,
					})
					.where(eq(calendarEventMetadata.eventId, input.eventId));

				return res;
			} catch (error) {
				const err = error as Record<string, unknown>;
				console.error("Corsair Update Error:", err);

				if (
					err?.status === 403 ||
					(typeof err?.message === "string" &&
						err.message.toLowerCase().includes("forbidden"))
				) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message:
							"You cannot edit this event because it belongs to a read-only or external subscribed calendar.",
					});
				}

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: `Google API Error: ${err?.message ?? JSON.stringify(err)}`,
					cause: err,
				});
			}
		}),

	deleteEvent: protectedProcedure
		.input(deleteEventInputModel)
		.mutation(async ({ ctx, input }) => {
			const { session } = ctx;
			const c = corsair.withTenant(session.user.id).googlecalendar;

			try {
				const eventMeta = await ctx.db.query.calendarEventMetadata.findFirst({
					where: eq(calendarEventMetadata.eventId, input.eventId),
					columns: { calendarId: true },
				});

				const actualCalendarId = eventMeta?.calendarId ?? input.calendarId;

				const res = await c.api.events.delete({
					calendarId: actualCalendarId,
					id: input.eventId,
				});

				await ctx.db
					.delete(calendarEventMetadata)
					.where(eq(calendarEventMetadata.eventId, input.eventId));

				return res;
			} catch (error) {
				const err = error as Record<string, unknown>;
				console.error("Corsair Delete Error:", err);

				if (
					err?.status === 403 ||
					(typeof err?.message === "string" &&
						err.message.toLowerCase().includes("forbidden"))
				) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message:
							"You cannot delete this event because it belongs to a read-only or external subscribed calendar.",
					});
				}

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: `Google API Error: ${err?.message ?? JSON.stringify(err)}`,
					cause: err,
				});
			}
		}),
});
