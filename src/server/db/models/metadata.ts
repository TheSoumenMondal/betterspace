import { pgTable, text, timestamp, vector } from "drizzle-orm/pg-core";
import { corsairAccounts } from "../schema";

export const emailAiMetadata = pgTable("email_ai_metadata", {
	entityId: text("entity_id").primaryKey(),

	accountId: text("account_id")
		.notNull()
		.references(() => corsairAccounts.id),

	summary: text("summary").notNull(),

	importance: text("importance")
		.$type<"low" | "medium" | "high">()
		.default("medium")
		.notNull(),

	category: text("category"),

	embedding: vector("embedding", {
		dimensions: 1536,
	}).notNull(),

	createdAt: timestamp("created_at").defaultNow().notNull(),
});
