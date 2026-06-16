import { addDays, addYears, startOfDay } from "date-fns";
import { eq } from "drizzle-orm";
import { corsair } from "@/corsair";
import { inngest } from "@/inngest/client";
import { generateSummaryAndEmbeddings } from "@/lib/openai";
import { db } from "@/server/db";
import {
	calendarEventChunks,
	calendarEventMetadata,
	user,
} from "@/server/db/schema";

const INITIAL_BATCH_SIZE = 50;
const CALENDAR_SYNC_EVENT = "sync/calendar.initial-sync.requested";
const CALENDAR_CONNECTED_EVENT = "sync/calendar.connected";

type CalendarSyncEventData = {
	userId: string;
	accountId: string;
	calendarId?: string;
	pageToken?: string | null;
	loadedCount?: number;
	rangeStart?: string;
	rangeEnd?: string;
};

type CalendarEvent = {
	id?: string;
	status?: "confirmed" | "tentative" | "cancelled";
	htmlLink?: string;
	created?: string;
	updated?: string;
	summary?: string;
	description?: string;
	location?: string;
	colorId?: string;
	creator?: {
		email?: string;
		displayName?: string;
		self?: boolean;
		id?: string;
	};
	organizer?: {
		email?: string;
		displayName?: string;
		self?: boolean;
		id?: string;
	};
	start?: { date?: string; dateTime?: string; timeZone?: string };
	end?: { date?: string; dateTime?: string; timeZone?: string };
	endTimeUnspecified?: boolean;
	recurrence?: string[];
	recurringEventId?: string;
	originalStartTime?: { date?: string; dateTime?: string; timeZone?: string };
	transparency?: "opaque" | "transparent";
	visibility?: "default" | "public" | "private" | "confidential";
	iCalUID?: string;
	sequence?: number;
	attendees?: Array<{
		email?: string;
		displayName?: string;
		self?: boolean;
		organizer?: boolean;
		resource?: boolean;
		optional?: boolean;
		responseStatus?: "needsAction" | "declined" | "tentative" | "accepted";
		comment?: string;
		additionalGuests?: number;
	}>;
	attendeesOmitted?: boolean;
	hangoutLink?: string;
	anyoneCanAddSelf?: boolean;
	guestsCanInviteOthers?: boolean;
	guestsCanModify?: boolean;
	guestsCanSeeOtherGuests?: boolean;
	privateCopy?: boolean;
	locked?: boolean;
	reminders?: unknown;
	source?: { url?: string; title?: string };
	attachments?: Array<{
		fileUrl?: string;
		title?: string;
		mimeType?: string;
		iconLink?: string;
		fileId?: string;
	}>;
	eventType?:
		| "default"
		| "outOfOffice"
		| "focusTime"
		| "workingLocation"
		| "birthday"
		| "fromGmail";
};

type CalendarSyncStep = {
	run<T>(id: string, fn: () => Promise<T>): Promise<T>;
	sendEvent<T = unknown>(
		id: string,
		payload:
			| { name: string; data: CalendarSyncEventData }
			| { name: string; data: CalendarSyncEventData }[],
	): Promise<T>;
};

type CalendarSyncHandlerContext = {
	event: { name: string; data: CalendarSyncEventData };
	step: CalendarSyncStep;
};

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

function normalizeWhitespace(value: string) {
	return value.replace(/\s+/g, " ").trim();
}

function parseDateTime(value?: string, fallbackTimeZone?: string) {
	if (!value) {
		return null;
	}

	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		const parsed = new Date(`${value}T00:00:00.000Z`);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	}

	const parsed = new Date(value);
	if (!Number.isNaN(parsed.getTime())) {
		return parsed;
	}

	return fallbackTimeZone ? new Date(value) : null;
}

function formatDateRangeLabel(event: CalendarEvent) {
	const startValue = event.start?.dateTime ?? event.start?.date ?? "";
	const endValue = event.end?.dateTime ?? event.end?.date ?? "";
	const startLabel = startValue ? `Start: ${startValue}` : "";
	const endLabel = endValue ? `End: ${endValue}` : "";
	return [startLabel, endLabel].filter(Boolean).join("\n");
}

function buildEventAnalysisText(event: CalendarEvent) {
	const attendeeLines = (event.attendees ?? [])
		.map((attendee) => {
			const name = attendee.displayName ?? attendee.email ?? "Unknown attendee";
			const status = attendee.responseStatus
				? ` (${attendee.responseStatus})`
				: "";
			return `- ${name}${status}`;
		})
		.join("\n");

	const creator = event.creator?.displayName ?? event.creator?.email ?? "";
	const organizer =
		event.organizer?.displayName ?? event.organizer?.email ?? "";
	const description = normalizeWhitespace(event.description ?? "");
	const location = normalizeWhitespace(event.location ?? "");
	const summary = normalizeWhitespace(event.summary ?? "");

	return normalizeWhitespace(
		[
			summary && `Summary: ${summary}`,
			description && `Description: ${description}`,
			location && `Location: ${location}`,
			creator && `Creator: ${creator}`,
			organizer && `Organizer: ${organizer}`,
			formatDateRangeLabel(event),
			attendeeLines && `Attendees:\n${attendeeLines}`,
			(event.eventType && `Event type: ${event.eventType}`) || "",
		]
			.filter(Boolean)
			.join("\n"),
	);
}

type CalendarPlan = "free" | "pro" | "pro_plus";

function getCalendarEndDate(plan: CalendarPlan, startDate: Date) {
	if (plan === "free") {
		return addDays(startDate, 30);
	}

	if (plan === "pro") {
		return addDays(startDate, 100);
	}

	return addYears(startDate, 1);
}

function buildEventChunks(input: {
	summary: string;
	details: string;
	embedding: number[];
	eventId: string;
	accountId: string;
	eventAt: Date | null;
}) {
	return [
		{
			eventId: input.eventId,
			accountId: input.accountId,
			chunkType: "summary" as const,
			content: input.summary,
			embedding: input.embedding,
			eventAt: input.eventAt,
		},
		{
			eventId: input.eventId,
			accountId: input.accountId,
			chunkType: "details" as const,
			content: input.details,
			embedding: input.embedding,
			eventAt: input.eventAt,
		},
	];
}

export const calendarInitialSync = inngest.createFunction(
	{
		id: "sync-calendar-initial",
		triggers: [
			{ event: CALENDAR_CONNECTED_EVENT },
			{ event: CALENDAR_SYNC_EVENT },
		],
	},
	async ({ event, step }: CalendarSyncHandlerContext) => {
		const data = event.data as CalendarSyncEventData;
		const loadedCount = data.loadedCount ?? 0;
		const calendarClient = corsair.withTenant(data.userId);

		const account = await step.run(
			`load-calendar-plan-${data.userId}`,
			async () => {
				const [row] = await db
					.select({ plan: user.plan })
					.from(user)
					.where(eq(user.id, data.userId))
					.limit(1);

				if (!row) {
					throw new Error(`Unable to load user plan for ${data.userId}`);
				}

				return row;
			},
		);

		const plan = account.plan as CalendarPlan;
		const startDate = data.rangeStart
			? new Date(data.rangeStart)
			: startOfDay(new Date());
		const endDate = data.rangeEnd
			? new Date(data.rangeEnd)
			: getCalendarEndDate(plan, startDate);

		const rangeStart = Number.isNaN(startDate.getTime())
			? startOfDay(new Date())
			: startDate;
		const rangeEnd = Number.isNaN(endDate.getTime())
			? getCalendarEndDate(plan, rangeStart)
			: endDate;

		if (event.name === CALENDAR_CONNECTED_EVENT) {
			const calendarIds = await step.run("get-calendar-list", async () => {
				const ids: string[] = ["primary"];
				try {
					const token =
						await calendarClient.googlecalendar.keys.get_access_token();
					const resp = await fetch(
						"https://www.googleapis.com/calendar/v3/users/me/calendarList",
						{ headers: { Authorization: `Bearer ${token}` } },
					);
					const calData = (await resp.json()) as {
						items?: { id: string; primary?: boolean }[];
					};
					if (Array.isArray(calData.items)) {
						for (const cal of calData.items) {
							if (!cal.primary && cal.id) ids.push(cal.id);
						}
					}
				} catch (err) {
					console.error("[CalendarSync] Failed to fetch calendar list:", err);
				}
				return ids;
			});

			// Fan out sync events for each calendar
			const syncEvents = calendarIds.map((calId) => ({
				name: CALENDAR_SYNC_EVENT,
				data: {
					userId: data.userId,
					accountId: data.accountId,
					calendarId: calId,
					loadedCount: 0,
					rangeStart: rangeStart.toISOString(),
					rangeEnd: rangeEnd.toISOString(),
				},
			}));

			if (syncEvents.length > 0) {
				await step.sendEvent("enqueue-calendar-sync-fanout", syncEvents);
			}

			return {
				message: `Fanned out sync for ${calendarIds.length} calendars.`,
			};
		}

		// From here on, we process a single calendar via CALENDAR_SYNC_EVENT
		const activeCalendarId = data.calendarId || "primary";
		const safeCalId = activeCalendarId.replace(/[^a-zA-Z0-9-]/g, "-");

		const batchSize = INITIAL_BATCH_SIZE;
		const page = await step.run(
			`list-calendar-events-${data.accountId}-${safeCalId}-${loadedCount}`,
			async () => {
				try {
					return await calendarClient.googlecalendar.api.events.getMany({
						calendarId: activeCalendarId,
						timeMin: rangeStart.toISOString(),
						timeMax: rangeEnd.toISOString(),
						singleEvents: true,
						orderBy: "startTime",
						maxResults: batchSize,
						pageToken: data.pageToken ?? undefined,
						showDeleted: false,
						showHiddenInvitations: true,
					});
				} catch (err) {
					const e = err as { status?: number; message?: string };
					if (e?.status === 404 || e?.message?.includes("Not Found")) {
						console.warn(
							`[Calendar Sync] Calendar ${activeCalendarId} not found, skipping.`,
						);
						return { items: [], nextPageToken: undefined };
					}
					throw err;
				}
			},
		);

		const events = (page.items ?? []).flatMap((calendarEvent) =>
			calendarEvent?.id ? [calendarEvent as CalendarEvent] : [],
		);

		let processedCount = 0;

		for (const calendarEvent of events) {
			if (processedCount >= batchSize) {
				break;
			}

			const eventId = calendarEvent.id;
			if (!eventId) {
				continue;
			}

			await step.run(
				`sync-calendar-event-${data.accountId}-${safeCalId}-${eventId}`,
				async () => {
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

					await db.transaction(async (tx: DbTransaction) => {
						await tx
							.delete(calendarEventChunks)
							.where(eq(calendarEventChunks.eventId, eventId));

						await tx
							.insert(calendarEventMetadata)
							.values({
								eventId,
								accountId: data.accountId,
								calendarId: activeCalendarId,
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
									accountId: data.accountId,
									calendarId: activeCalendarId,
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
								eventId,
								accountId: data.accountId,
								eventAt: eventDate,
							}),
						);
					});
				},
			);

			processedCount += 1;
		}

		const nextPageToken = page.nextPageToken;
		const nextLoadedCount = loadedCount + processedCount;

		if (nextPageToken) {
			await step.sendEvent(
				`enqueue-calendar-sync-${data.accountId}-${safeCalId}-${nextLoadedCount}`,
				{
					name: CALENDAR_SYNC_EVENT,
					data: {
						userId: data.userId,
						accountId: data.accountId,
						calendarId: activeCalendarId,
						pageToken: nextPageToken,
						loadedCount: nextLoadedCount,
						rangeStart: rangeStart.toISOString(),
						rangeEnd: rangeEnd.toISOString(),
					},
				},
			);
		}

		return {
			loadedCount: nextLoadedCount,
			rangeStart: rangeStart.toISOString(),
			rangeEnd: rangeEnd.toISOString(),
			completed: !nextPageToken,
		};
	},
);
