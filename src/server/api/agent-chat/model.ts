import { z } from "zod";

export const conversationIdInput = z.object({
	conversationId: z.uuid(),
});

export const createConversationInput = z.object({
	message: z.string().trim().min(1).max(10_000),
});

export const runAgentInput = z.object({
	conversationId: z.uuid(),
	message: z.string().trim().min(1).max(10_000),
	userMessagePersisted: z.boolean().default(false),
});

export const toolInvocationSchema = z.object({
	toolCallId: z.string(),
	toolName: z.string(),
	args: z.record(z.string(), z.unknown()),
	state: z.literal("result"),
	result: z.string(),
});

export const chatMessageSchema = z.object({
	id: z.string(),
	role: z.enum(["user", "assistant"]),
	content: z.string(),
	createdAt: z.date().nullable(),
});

export const conversationSchema = z.object({
	id: z.string(),
	title: z.string().nullable(),
	messages: z.array(chatMessageSchema),
});

export const createConversationOutput = z.object({
	conversationId: z.string(),
	title: z.string(),
});

export const conversationOutput = conversationSchema.nullable();
