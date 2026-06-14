import {
	boolean,
	index,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	vector,
} from "drizzle-orm/pg-core";
import { corsairAccounts } from "../schema";

export const calendarChunkTypeEnum = pgEnum("calendar_chunk_type", [
	"summary",
	"details",
]);

export const calendarEventMetadata = pgTable("calendar_event_metadata", {
	eventId: text("event_id").primaryKey(),

	accountId: text("account_id")
		.notNull()
		.references(() => corsairAccounts.id),

	calendarId: text("calendar_id"),
	iCalUID: text("i_cal_uid"),

	summary: text("summary"),
	description: text("description"),
	location: text("location"),
	status: text("status"),
	eventType: text("event_type"),

	startAt: timestamp("start_at"),
	endAt: timestamp("end_at"),
	timeZone: text("time_zone"),
	allDay: boolean("all_day").default(false).notNull(),

	organizerEmail: text("organizer_email"),
	organizerName: text("organizer_name"),
	attendees: jsonb("attendees").notNull().default([]),
	rawEvent: jsonb("raw_event").notNull().default({}),

	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const calendarEventChunks = pgTable(
	"calendar_event_chunks",
	{
		id: uuid("id").primaryKey().defaultRandom(),

		eventId: text("event_id")
			.notNull()
			.references(() => calendarEventMetadata.eventId, { onDelete: "cascade" }),

		accountId: text("account_id")
			.notNull()
			.references(() => corsairAccounts.id),

		chunkType: calendarChunkTypeEnum("chunk_type").notNull(),
		content: text("content").notNull(),

		embedding: vector("embedding", { dimensions: 1536 }).notNull(),

		eventAt: timestamp("event_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("calendar_event_chunks_embedding_idx").using(
			"hnsw",
			table.embedding.op("vector_cosine_ops"),
		),
		index("calendar_event_chunks_account_date_idx").on(
			table.accountId,
			table.eventAt,
		),
		index("calendar_event_chunks_type_idx").on(
			table.accountId,
			table.chunkType,
		),
	],
);
