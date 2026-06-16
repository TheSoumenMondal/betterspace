import OpenAI from "openai";
import { env } from "@/env";

type GeneratedEmailInformation = {
	summary: string;
	actionItems: string[];
	entities: {
		persons: string[];
		organizations: string[];
		locations: string[];
		dates: string[];
		amounts: string[];
	};
	importance: "low" | "medium" | "high";
	priorityScore: number;
	category:
		| "action-needed"
		| "meeting"
		| "invoice"
		| "newsletter"
		| "fyi"
		| "spam";
	hasMeetingSignal: boolean;
	hasDeadline: boolean;
	hasInvoice: boolean;
	hasAttachment: boolean;
};

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

export async function generateEmbedding(text: string) {
	const tokenSafeText = text.length > 6000 ? text.slice(0, 6000) : text;
	const response = await openai.embeddings.create({
		model: "text-embedding-3-small",
		input: tokenSafeText,
	});
	return response.data[0]?.embedding ?? [];
}

export async function generateSummaryAndEmbeddings(text: string) {
	if (!text.trim()) {
		return {
			summary: "",
			embedding: [],
		};
	}

	const tokenSafeText = text.length > 6000 ? text.slice(0, 6000) : text;

	const [summaryResponse, embedding] = await Promise.all([
		openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						"Summarize the content in 2 concise sentences. Include important details.",
				},
				{
					role: "user",
					content: tokenSafeText,
				},
			],
			max_completion_tokens: 80,
		}),

		generateEmbedding(tokenSafeText),
	]);

	return {
		summary: summaryResponse.choices[0]?.message.content?.trim() ?? "",
		embedding,
	};
}

export async function ExtraInformationFromEmail(text: string) {
	if (!text.trim()) {
		return {
			information: {
				summary: "",
				actionItems: [],
				entities: {
					persons: [],
					organizations: [],
					locations: [],
					dates: [],
					amounts: [],
				},
				importance: "low",
				priorityScore: 0,
				category: "fyi",
				hasMeetingSignal: false,
				hasDeadline: false,
				hasInvoice: false,
				hasAttachment: false,
			} as GeneratedEmailInformation,
			embedding: [],
		};
	}

	const tokenSafeText = text.length > 6000 ? text.slice(0, 6000) : text;

	const [information, embedding] = await Promise.all([
		openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: `You are an email analysis assistant. Analyze the email below and return ONLY a valid JSON object. No markdown, no explanation, no code blocks — raw JSON only.
						Return this exact JSON shape:
						{
						"summary": "2 sentence max. What is this email about and why does it matter?",
						"actionItems": ["specific thing to do", "another action"],
						"entities": {
							"persons": ["full names of people mentioned"],
							"organizations": ["company or team names"],
							"locations": ["cities, countries, addresses"],
							"dates": ["specific dates or deadlines mentioned"],
							"amounts": ["monetary values, quantities"]
						},
						"importance": "low | medium | high",
						"priorityScore": <integer 0-100>,
						"category": "action-needed | meeting | invoice | newsletter | fyi | spam",
						"hasMeetingSignal": <true if email mentions a meeting, call, or interview>,
						"hasDeadline": <true if email mentions a due date or deadline>,
						"hasInvoice": <true if email is about payment, billing, or invoice>
						}
						"hasAttachment": <true if email mentions an attachment or includes one>

						Scoring guide for priorityScore:
						- 90-100: Urgent, requires immediate action today
						- 70-89: Important, action needed within 24-48 hours  
						- 50-69: Moderate, should be addressed this week
						- 30-49: Low priority, informational
						- 0-29: Newsletter, spam, or no action needed

						category guide:
						- action-needed: sender is asking you to do something
						- meeting: invite, scheduling, or follow-up from a call
						- invoice: payment request, receipt, billing
						- newsletter: bulk email, marketing, subscriptions
						- fyi: informational, no action required
						- spam: unsolicited or irrelevant

						If a field has no data, return an empty array [] for arrays or null for strings. Never omit a field.`,
				},
				{
					role: "user",
					content: tokenSafeText,
				},
			],
			max_completion_tokens: 1500,
			response_format: { type: "json_object" },
		}),

		generateEmbedding(tokenSafeText),
	]);

	let parsedInformation: GeneratedEmailInformation;
	try {
		parsedInformation = JSON.parse(
			information.choices[0]?.message.content as string,
		) as GeneratedEmailInformation;
	} catch (_e) {
		console.error(
			"Failed to parse JSON from AI response",
			information.choices[0]?.message.content,
		);
		parsedInformation = {
			summary: "",
			actionItems: [],
			entities: {
				persons: [],
				organizations: [],
				locations: [],
				dates: [],
				amounts: [],
			},
			importance: "low",
			priorityScore: 0,
			category: "fyi",
			hasMeetingSignal: false,
			hasDeadline: false,
			hasInvoice: false,
			hasAttachment: false,
		};
	}

	return {
		information: parsedInformation,
		embedding,
	};
}
