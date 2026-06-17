import { eq } from "drizzle-orm";
import { inngest } from "@/inngest/client";
import { generateSummaryAndEmbeddings } from "@/lib/openai";
import { db } from "@/server/db";
import { calendarEventChunks, calendarEventMetadata } from "@/server/db/schema";
import {
	buildEventAnalysisText,
	buildEventChunks,
	type CalendarEvent,
	parseDateTime,
} from "./initial-sync-calendar";

export const calendarIncomingEvent = inngest.createFunction(
	{
		id: "calendar-incoming-event",
		triggers: [{ event: "sync/calendar.event.received" }],
	},
	async ({ event, step }) => {
		const { accountId, calendarId, eventType, calendarEvent, eventId } =
			event.data as {
				accountId: string;
				calendarId: string;
				eventType: "eventCreated" | "eventUpdated" | "eventDeleted";
				calendarEvent?: CalendarEvent;
				eventId?: string;
			};

		if (eventType === "eventDeleted") {
			const idToRemove = eventId ?? calendarEvent?.id;
			if (!idToRemove) return { status: "ignored", reason: "no event id" };

			await step.run(`delete-calendar-event-${idToRemove}`, async () => {
				await db.transaction(async (tx) => {
					await tx
						.delete(calendarEventChunks)
						.where(eq(calendarEventChunks.eventId, idToRemove));
					await tx
						.delete(calendarEventMetadata)
						.where(eq(calendarEventMetadata.eventId, idToRemove));
				});
			});

			return { status: "deleted", eventId: idToRemove };
		}

		if (!calendarEvent?.id) {
			return { status: "ignored", reason: "no event payload" };
		}

		const eventIdToUpdate = calendarEvent.id;

		await step.run(`upsert-calendar-event-${eventIdToUpdate}`, async () => {
			const details = buildEventAnalysisText(calendarEvent);
			const analysis = await generateSummaryAndEmbeddings(details);
			const eventDetails = details;

			const startAt = parseDateTime(
				calendarEvent.start?.dateTime ?? calendarEvent.start?.date,
				calendarEvent.start?.timeZone,
			);
			const endAt = parseDateTime(
				calendarEvent.end?.dateTime ?? calendarEvent.end?.date,
				calendarEvent.end?.timeZone,
			);
			const embedding =
				analysis.embedding.length > 0
					? analysis.embedding
					: new Array(1536).fill(0);
			const eventDate = startAt ?? endAt;

			type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

			await db.transaction(async (tx: DbTransaction) => {
				await tx
					.delete(calendarEventChunks)
					.where(eq(calendarEventChunks.eventId, eventIdToUpdate));

				await tx
					.insert(calendarEventMetadata)
					.values({
						eventId: eventIdToUpdate,
						accountId,
						calendarId,
						iCalUID: calendarEvent.iCalUID ?? null,
						summary: calendarEvent.summary ?? null,
						description: calendarEvent.description ?? null,
						location: calendarEvent.location ?? null,
						status: calendarEvent.status ?? null,
						eventType: calendarEvent.eventType ?? null,
						startAt,
						endAt,
						timeZone:
							calendarEvent.start?.timeZone ??
							calendarEvent.end?.timeZone ??
							null,
						allDay: Boolean(
							calendarEvent.start?.date && !calendarEvent.start?.dateTime,
						),
						organizerEmail: calendarEvent.organizer?.email ?? null,
						organizerName:
							calendarEvent.organizer?.displayName ??
							calendarEvent.organizer?.email ??
							null,
						attendees: calendarEvent.attendees ?? [],
						rawEvent: calendarEvent,
					})
					.onConflictDoUpdate({
						target: calendarEventMetadata.eventId,
						set: {
							accountId,
							calendarId,
							iCalUID: calendarEvent.iCalUID ?? null,
							summary: calendarEvent.summary ?? null,
							description: calendarEvent.description ?? null,
							location: calendarEvent.location ?? null,
							status: calendarEvent.status ?? null,
							eventType: calendarEvent.eventType ?? null,
							startAt,
							endAt,
							timeZone:
								calendarEvent.start?.timeZone ??
								calendarEvent.end?.timeZone ??
								null,
							allDay: Boolean(
								calendarEvent.start?.date && !calendarEvent.start?.dateTime,
							),
							organizerEmail: calendarEvent.organizer?.email ?? null,
							organizerName:
								calendarEvent.organizer?.displayName ??
								calendarEvent.organizer?.email ??
								null,
							attendees: calendarEvent.attendees ?? [],
							rawEvent: calendarEvent,
						},
					});

				await tx.insert(calendarEventChunks).values(
					buildEventChunks({
						summary: analysis.summary,
						details: eventDetails,
						embedding,
						eventId: eventIdToUpdate,
						accountId,
						eventAt: eventDate,
					}),
				);
			});
		});

		return { status: "upserted", eventId: eventIdToUpdate };
	},
);
