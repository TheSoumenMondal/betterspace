import OpenAI from "openai";
import { env } from "@/env";

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
});

export async function generateConversationTitle(message: string) {
	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{
				role: "system",
				content:
					"Create a precise conversation title of 2 to 5 words. Return only the title with no quotes, punctuation, or markdown.",
			},
			{
				role: "user",
				content: message.slice(0, 1000),
			},
		],
		max_completion_tokens: 20,
	});

	const generated =
		response.choices[0]?.message.content
			?.replace(/[#*_`"'.,!?;:()[\]{}]/g, "")
			.replace(/\s+/g, " ")
			.trim()
			.split(" ")
			.slice(0, 5)
			.join(" ") ?? "";

	return generated || "New Conversation";
}

export async function generateSummaryAndEmbeddings(text: string) {
	if (!text.trim()) {
		return {
			summary: "",
			embedding: [],
		};
	}

	const tokenSafeText = text.length > 6000 ? text.slice(0, 6000) : text;

	const [summaryResponse, embeddingResponse] = await Promise.all([
		openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						"Summarize the email in 2 concise sentences. Include important action items, deadlines, or requests.",
				},
				{
					role: "user",
					content: tokenSafeText,
				},
			],
			max_completion_tokens: 80,
		}),

		openai.embeddings.create({
			model: "text-embedding-3-small",
			input: tokenSafeText,
		}),
	]);

	return {
		summary: summaryResponse.choices[0]?.message.content?.trim() ?? "",
		embedding: embeddingResponse.data[0]?.embedding ?? [],
	};
}
