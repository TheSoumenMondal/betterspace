import { z } from "zod";

export const createDraftMailInput = z.object({
	sender: z.string().describe("The email address of the sender"),
	to: z
		.array(z.string())
		.describe("An array of email addresses of the recipients"),
	cc: z
		.array(z.string())
		.describe("An array of email addresses of the cc recipients")
		.optional(),
	bcc: z
		.array(z.string())
		.describe("An array of email addresses of the bcc recipients")
		.optional(),
	subject: z.string().describe("The subject of the email"),
	body: z.string().describe("The body content of the email"),
});

export const createDraftMailOutput = z.object({
	draftId: z.string().describe("The unique identifier of the created draft"),
	messageId: z
		.string()
		.describe(
			"The unique identifier of the email message associated with the draft",
		),
	threadId: z
		.string()
		.describe(
			"The unique identifier of the email thread associated with the draft",
		),
	createdAt: z
		.string()
		.describe("The timestamp when the draft was created in ISO 8601 format"),
});

export const getAllMailsInput = z.object({
	limit: z.number().min(1).max(100).default(20),
	cursor: z.number().nullish(), // offset
	labelId: z.string().optional(),
	sort: z.enum(["newest", "oldest", "priorityDesc", "priorityAsc"]).optional(),
	importance: z.array(z.enum(["low", "medium", "high"])).optional(),
	hasMeetingSignal: z.boolean().optional(),
	hasDeadline: z.boolean().optional(),
	hasInvoice: z.boolean().optional(),
	hasAttachment: z.boolean().optional(),
});

export const getAllMailsOutput = z.object({
	items: z.array(z.any()),
	nextCursor: z.number().nullable(),
});

export const searchMailsInput = z.object({
	query: z.string(),
	limit: z.number().min(1).max(100).default(20),
	cursor: z.string().nullish(), // page token
});

export const searchMailsOutput = z.object({
	items: z.array(z.any()),
	nextCursor: z.string().nullable(),
});
