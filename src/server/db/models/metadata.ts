import {
	boolean,
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	vector,
} from "drizzle-orm/pg-core";
import { corsairAccounts } from "../schema";

export const importanceEnum = pgEnum("importance_level", [
	"low",
	"medium",
	"high",
]);

export const chunkTypeEnum = pgEnum("chunk_type", [
	"summary",
	"body",
	"entities",
	"action_items",
]);

export const emailAiMetadata = pgTable("email_ai_metadata", {
	emailId: text("email_id").primaryKey(),

	accountId: text("account_id")
		.notNull()
		.references(() => corsairAccounts.id),

	threadId: text("thread_id"),
	subject: text("subject"),
	fromAddress: text("from_address"),

	summary: text("summary").notNull(),
	actionItems: text("action_items"),
	entities: text("entities"),

	importance: importanceEnum("importance").default("medium").notNull(),
	category: text("category"),

	hasMeetingSignal: boolean("has_meeting_signal").default(false).notNull(),
	hasDeadline: boolean("has_deadline").default(false).notNull(),
	hasInvoice: boolean("has_invoice").default(false).notNull(),
	hasAttachment: boolean("has_attachment").default(false).notNull(),

	emailDate: timestamp("email_date").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emailChunks = pgTable(
	"email_chunks",
	{
		id: uuid("id").primaryKey().defaultRandom(),

		emailId: text("email_id")
			.notNull()
			.references(() => emailAiMetadata.emailId, { onDelete: "cascade" }),

		accountId: text("account_id")
			.notNull()
			.references(() => corsairAccounts.id),

		chunkType: chunkTypeEnum("chunk_type").notNull(),
		content: text("content").notNull(),

		embedding: vector("embedding", { dimensions: 1536 }).notNull(),

		emailDate: timestamp("email_date").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("email_chunks_embedding_idx").using(
			"hnsw",
			table.embedding.op("vector_cosine_ops"),
		),
		index("email_chunks_account_date_idx").on(table.accountId, table.emailDate),
		index("email_chunks_type_idx").on(table.accountId, table.chunkType),
	],
);
