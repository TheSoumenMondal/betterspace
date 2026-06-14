import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const usage = pgTable("usage", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, {
			onDelete: "cascade",
		}),
	month: text("month").notNull(),
	aiActionsUsed: integer("ai_actions_used").default(0).notNull(),
	voiceMinutesUsed: integer("voice_minutes_used").default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
