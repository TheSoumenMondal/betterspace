import { z } from "zod";

export const calendarDateTimeSchema = z.object({
	date: z
		.string()
		.optional()
		.describe(
			"All-day events will have this field set, with the date in YYYY-MM-DD format. The timeZone field will be ignored. If this is not specified, the event is not an all-day event and you can expect dateTime to be present.",
		),
	dateTime: z
		.string()
		.optional()
		.describe(
			"The time at which the event starts or ends. This field is used for both all-day and timed events. For timed events, the format is RFC3339 timestamp. For all-day events, the format is YYYY-MM-DD. The timeZone field is used to interpret the dateTime value for timed events.",
		),
	timeZone: z
		.string()
		.optional()
		.describe(
			"The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. 'America/Los_Angeles'.) For recurring events this field is required if either start.dateTime or end.dateTime is used to specify the event time. If this field is not specified, the event time is interpreted as floating in the calendar's time zone.",
		),
});

export const calendarPersonSchema = z.object({
	id: z
		.string()
		.optional()
		.describe(
			"The person's email address, unless the email field is not available, when it will be a unique identifier for the person.",
		),
	email: z.string().optional().describe("The person's email address."),
	displayName: z.string().optional().describe("The person's display name."),
	self: z
		.boolean()
		.optional()
		.describe("Whether the person is the authenticated user."),
});

export const calendarAttendeeSchema = z.object({
	id: z.string().optional().describe("The attendee's unique identifier."),
	email: z.string().optional().describe("The attendee's email address."),
	displayName: z.string().optional().describe("The attendee's display name."),
	organizer: z
		.boolean()
		.optional()
		.describe("Whether the attendee is the organizer of the event."),
	self: z
		.boolean()
		.optional()
		.describe("Whether the attendee is the authenticated user."),
	resource: z
		.boolean()
		.optional()
		.describe(
			"Whether the attendee is a resource (e.g., a room or equipment).",
		),
	optional: z
		.boolean()
		.optional()
		.describe("Whether the attendee is optional."),
	responseStatus: z
		.enum(["needsAction", "declined", "tentative", "accepted"])
		.optional()
		.describe(
			"The attendee's response status. Possible values are: - 'needsAction' - The attendee has not responded to the invitation. - 'declined' - The attendee has declined the invitation. - 'tentative' - The attendee has tentatively accepted the invitation. - 'accepted' - The attendee has accepted the invitation.",
		),
	comment: z.string().optional().describe("A comment about the attendee."),
	additionalGuests: z
		.number()
		.optional()
		.describe("The number of additional guests expected."),
});

export const calendarReminderSchema = z.object({
	useDefault: z
		.boolean()
		.optional()
		.describe("Whether to use the default reminder settings."),
	overrides: z
		.array(
			z.object({
				method: z
					.enum(["email", "popup"])
					.optional()
					.describe("The method of the reminder."),
				minutes: z
					.number()
					.optional()
					.describe(
						"The number of minutes before the event to trigger the reminder.",
					),
			}),
		)
		.optional(),
});

export const calendarEventSchema = z.object({
	id: z
		.string()
		.optional()
		.describe("Opaque identifier of the event. See IDs for more information."),
	status: z
		.enum(["confirmed", "tentative", "cancelled"])
		.optional()
		.describe(
			"The status of the event. Optional. Possible values are: - 'confirmed' - The event is confirmed. This is the default status. - 'tentative' - The event is tentatively confirmed. - 'cancelled' - The event is cancelled (deleted).",
		),
	htmlLink: z
		.string()
		.optional()
		.describe(
			"The URL of the event's page in the Google Calendar web interface.",
		),
	created: z.string().optional().describe("The time the event was created."),
	updated: z
		.string()
		.optional()
		.describe("The time the event was last updated."),
	summary: z.string().optional().describe("The title of the event."),
	description: z.string().optional().describe("The description of the event."),
	location: z.string().optional().describe("The location of the event."),
	colorId: z.string().optional().describe("The color of the event."),
	creator: calendarPersonSchema
		.optional()
		.describe("The creator of the event."),
	organizer: calendarPersonSchema
		.optional()
		.describe("The organizer of the event."),
	start: calendarDateTimeSchema
		.optional()
		.describe("The start time of the event."),
	end: calendarDateTimeSchema.optional().describe("The end time of the event."),
	endTimeUnspecified: z
		.boolean()
		.optional()
		.describe("Whether the end time is unspecified."),
	recurrence: z
		.array(z.string())
		.optional()
		.describe("The recurrence rules for the event."),
	recurringEventId: z
		.string()
		.optional()
		.describe("The ID of the recurring event."),
	originalStartTime: calendarDateTimeSchema
		.optional()
		.describe("The original start time of the event."),
	transparency: z
		.enum(["opaque", "transparent"])
		.optional()
		.describe("The transparency of the event."),
	visibility: z
		.enum(["default", "public", "private", "confidential"])
		.optional()
		.describe("The visibility of the event."),
	iCalUID: z.string().optional().describe("The iCalendar ID of the event."),
	sequence: z.number().optional().describe("The sequence number of the event."),
	attendees: z
		.array(calendarAttendeeSchema)
		.optional()
		.describe("The attendees of the event."),
	attendeesOmitted: z
		.boolean()
		.optional()
		.describe("Whether the list of attendees is omitted."),
	hangoutLink: z
		.string()
		.optional()
		.describe("The URL of the Google Hangout link for the event."),
	reminders: calendarReminderSchema
		.optional()
		.describe("The reminders for the event."),
	anyoneCanAddSelf: z
		.boolean()
		.optional()
		.describe("Whether anyone can add themselves to the event."),
	guestsCanInviteOthers: z
		.boolean()
		.optional()
		.describe("Whether guests can invite others to the event."),
	guestsCanModify: z
		.boolean()
		.optional()
		.describe("Whether guests can modify the event."),
	guestsCanSeeOtherGuests: z
		.boolean()
		.optional()
		.describe("Whether guests can see other guests."),
	privateCopy: z
		.boolean()
		.optional()
		.describe("Whether this is a private copy of the event."),
	locked: z.boolean().optional().describe("Whether the event is locked."),
	eventType: z.string().optional().describe("The type of the event."),
});

export const getEventsInputModel = z
	.object({
		calendarId: z
			.string()
			.default("primary")
			.describe(
				"The ID of the calendar to retrieve events from. Use 'primary' to retrieve from the primary calendar of the authenticated user.",
			),
		timeMin: z
			.string()
			.optional()
			.describe("The start time of the time range to retrieve events from."),
		timeMax: z
			.string()
			.optional()
			.describe("The end time of the time range to retrieve events from."),
		timeZone: z
			.string()
			.optional()
			.describe("The time zone of the time range to retrieve events from."),
		singleEvents: z
			.boolean()
			.default(true)
			.describe(
				"Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves.",
			),
		maxResults: z
			.number()
			.min(1)
			.max(250)
			.default(50)
			.describe("The maximum number of events to return per page."),
		pageToken: z
			.string()
			.nullish()
			.describe("The token to retrieve the next page of results."),
		orderBy: z
			.enum(["startTime", "updated"])
			.default("startTime")
			.describe("The field to order events by."),
		q: z
			.string()
			.optional()
			.describe(
				"Free text search terms to find events that match these terms.",
			),
	})
	.optional();

export const getEventsOutputModel = z.object({
	items: z
		.array(calendarEventSchema)
		.describe("The events returned by the query."),
	nextPageToken: z
		.string()
		.nullable()
		.describe("The token to retrieve the next page of results."),
	timeZone: z
		.string()
		.optional()
		.describe("The time zone of the time range to retrieve events from."),
});
