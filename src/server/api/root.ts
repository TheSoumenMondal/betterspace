import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { accountRouter } from "./account/route";
import { agentChatRouter } from "./agent-chat/route";
import { chatRouter } from "./chat/route";
import { gmailRoute } from "./gmail/route";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	account: accountRouter,
	agentChat: agentChatRouter,
	chat: chatRouter,
	gmail: gmailRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
