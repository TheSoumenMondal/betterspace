import { z } from "zod";

export const getConversationsOutput = z.array(
	z.object({
		id: z.string(),
		title: z.string().nullable(),
		createdAt: z.date().nullable(),
	}),
);
