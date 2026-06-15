import type { AgentInputItem } from "@openai/agents";
import { run } from "@openai/agents";
import { TRPCError } from "@trpc/server";
import { and, asc, eq } from "drizzle-orm";
import { corsair } from "@/corsair";
import { generateConversationTitle } from "@/lib/openai";
import { createRouterAgent } from "@/server/agents/router-agent";
import type { db } from "@/server/db";
import { conversations, messages } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
	conversationIdInput,
	conversationOutput,
	createConversationInput,
	createConversationOutput,
	runAgentInput,
} from "./model";

export type AgentStreamEvent =
	| { type: "status"; message: string }
	| { type: "title"; title: string }
	| { type: "agent"; agent: string }
	| {
			type: "tool_call";
			toolCallId: string;
			toolName: string;
			args: Record<string, unknown>;
	  }
	| { type: "tool_result"; toolCallId: string; result: string }
	| { type: "text_delta"; delta: string }
	| {
			type: "done";
			message: {
				id: string;
				role: "assistant";
				content: string;
				createdAt: Date | null;
			};
	  }
	| { type: "error"; message: string };

function toAgentInput(
	history: Array<{ role: string; content: string }>,
): AgentInputItem[] {
	return history.map((message) => {
		if (message.role === "assistant") {
			return {
				role: "assistant",
				status: "completed",
				content: [{ type: "output_text", text: message.content }],
			};
		}

		return {
			role: "user",
			content: message.content,
		};
	});
}

function parseToolArguments(value: string): Record<string, unknown> {
	try {
		return JSON.parse(value) as Record<string, unknown>;
	} catch {
		return {};
	}
}

function stringifyToolResult(value: unknown): string {
	return typeof value === "string" ? value : JSON.stringify(value);
}

function shouldGenerateTitle(title: string | null) {
	return (
		!title ||
		title === "New Conversation" ||
		title.length > 40 ||
		title.trim().split(/\s+/).length > 5
	);
}

async function assertConversationOwner(
	database: typeof db,
	conversationId: string,
	userId: string,
) {
	const [conversation] = await database
		.select({ id: conversations.id, title: conversations.title })
		.from(conversations)
		.where(
			and(
				eq(conversations.id, conversationId),
				eq(conversations.userId, userId),
			),
		)
		.limit(1);

	if (!conversation) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Conversation not found",
		});
	}

	return conversation;
}

export const agentChatRouter = createTRPCRouter({
	byId: protectedProcedure
		.input(conversationIdInput)
		.output(conversationOutput)
		.query(async ({ ctx, input }) => {
			const conversation = await assertConversationOwner(
				ctx.db,
				input.conversationId,
				ctx.session.user.id,
			);

			const history = await ctx.db
				.select({
					id: messages.id,
					role: messages.role,
					content: messages.content,
					createdAt: messages.createdAt,
				})
				.from(messages)
				.where(eq(messages.conversationId, conversation.id))
				.orderBy(asc(messages.createdAt));

			let title = conversation.title;
			const firstUserMessage = history.find(
				(message) => message.role === "user",
			);
			if (firstUserMessage && shouldGenerateTitle(title)) {
				try {
					title = await generateConversationTitle(firstUserMessage.content);
					await ctx.db
						.update(conversations)
						.set({ title })
						.where(eq(conversations.id, conversation.id));
				} catch {
					// Keep the existing title if title generation is unavailable.
				}
			}

			return {
				...conversation,
				title,
				messages: history.filter(
					(
						message,
					): message is typeof message & {
						role: "user" | "assistant";
					} => message.role === "user" || message.role === "assistant",
				),
			};
		}),

	create: protectedProcedure
		.input(createConversationInput)
		.output(createConversationOutput)
		.mutation(async ({ ctx, input }) => {
			const title = "New Conversation";
			const [conversation] = await ctx.db
				.insert(conversations)
				.values({
					userId: ctx.session.user.id,
					title,
				})
				.returning({ id: conversations.id });

			if (!conversation) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Could not create conversation",
				});
			}

			await ctx.db.insert(messages).values({
				conversationId: conversation.id,
				role: "user",
				content: input.message,
			});

			return { conversationId: conversation.id, title };
		}),

	run: protectedProcedure.input(runAgentInput).subscription(async function* ({
		ctx,
		input,
	}): AsyncGenerator<AgentStreamEvent> {
		try {
			await assertConversationOwner(
				ctx.db,
				input.conversationId,
				ctx.session.user.id,
			);

			if (!input.userMessagePersisted) {
				await ctx.db.insert(messages).values({
					conversationId: input.conversationId,
					role: "user",
					content: input.message,
				});
			}

			const existingConversation = await assertConversationOwner(
				ctx.db,
				input.conversationId,
				ctx.session.user.id,
			);
			if (shouldGenerateTitle(existingConversation.title)) {
				try {
					yield { type: "status", message: "Creating a concise title" };
					const title = await generateConversationTitle(input.message);
					await ctx.db
						.update(conversations)
						.set({ title })
						.where(eq(conversations.id, input.conversationId));
					yield { type: "title", title };
				} catch {
					// Title generation should never block the conversation.
				}
			}

			const history = await ctx.db
				.select({ role: messages.role, content: messages.content })
				.from(messages)
				.where(eq(messages.conversationId, input.conversationId))
				.orderBy(asc(messages.createdAt));

			yield { type: "status", message: "Router is deciding what to do" };

			const routerAgent = createRouterAgent(
				corsair.withTenant(ctx.session.user.id),
				{ userName: ctx.session.user.name },
			);
			const result = await run(routerAgent, toAgentInput(history), {
				stream: true,
			});

			for await (const event of result) {
				if (event.type === "agent_updated_stream_event") {
					yield { type: "agent", agent: event.agent.name };
					continue;
				}

				if (
					event.type === "raw_model_stream_event" &&
					event.data.type === "output_text_delta"
				) {
					yield { type: "text_delta", delta: event.data.delta };
					continue;
				}

				if (
					event.type === "run_item_stream_event" &&
					event.name === "tool_called" &&
					event.item.type === "tool_call_item" &&
					event.item.rawItem.type === "function_call"
				) {
					yield {
						type: "tool_call",
						toolCallId: event.item.rawItem.callId,
						toolName: event.item.rawItem.name,
						args: parseToolArguments(event.item.rawItem.arguments),
					};
					continue;
				}

				if (
					event.type === "run_item_stream_event" &&
					event.name === "tool_output" &&
					event.item.type === "tool_call_output_item" &&
					event.item.rawItem.type === "function_call_result"
				) {
					yield {
						type: "tool_result",
						toolCallId: event.item.rawItem.callId,
						result: stringifyToolResult(event.item.output),
					};
				}
			}

			const content =
				typeof result.finalOutput === "string"
					? result.finalOutput
					: JSON.stringify(
							result.finalOutput ?? "I could not complete that request.",
						);
			const [assistantMessage] = await ctx.db
				.insert(messages)
				.values({
					conversationId: input.conversationId,
					role: "assistant",
					content,
				})
				.returning({
					id: messages.id,
					content: messages.content,
					createdAt: messages.createdAt,
				});

			await ctx.db
				.update(conversations)
				.set({ updatedAt: new Date() })
				.where(eq(conversations.id, input.conversationId));

			if (!assistantMessage) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Could not save assistant response",
				});
			}

			yield {
				type: "done",
				message: { ...assistantMessage, role: "assistant" },
			};
		} catch (error) {
			yield {
				type: "error",
				message: error instanceof Error ? error.message : "Agent run failed",
			};
		}
	}),
});
