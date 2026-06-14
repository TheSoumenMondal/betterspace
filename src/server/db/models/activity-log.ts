import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../schema";

export const activityLog = pgTable("activity_log", {
	id: text("id").primaryKey(),

	userId: text("user_id")
		.notNull()
		.references(() => user.id),

	type: text("type").notNull(),

	metadata: jsonb("metadata").notNull().default({}),

	createdAt: timestamp("created_at").defaultNow().notNull(),
});
