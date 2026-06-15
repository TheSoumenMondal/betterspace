import { desc, eq } from "drizzle-orm";
import { conversations } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getConversationsOutput } from "./model";

export const chatRouter = createTRPCRouter({
	history: protectedProcedure
		.output(getConversationsOutput)
		.query(async ({ ctx }) => {
			const history = await ctx.db
				.select({
					id: conversations.id,
					title: conversations.title,
					createdAt: conversations.createdAt,
				})
				.from(conversations)
				.where(eq(conversations.userId, ctx.session.user.id))
				.orderBy(desc(conversations.updatedAt))
				.limit(50);

			return history;
		}),
});
