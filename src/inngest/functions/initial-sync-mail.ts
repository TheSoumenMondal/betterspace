import { Buffer } from "node:buffer";
import { eq } from "drizzle-orm";
import { corsair } from "@/corsair";
import { inngest } from "@/inngest/client";
import { generateSummaryAndEmbeddings } from "@/lib/openai";
import { PLANS } from "@/lib/plans";
import { db } from "@/server/db";
import { emailAiMetadata, emailChunks, user } from "@/server/db/schema";

const INITIAL_BATCH_SIZE = 30;
const GMAIL_SYNC_EVENT = "sync/gmail.initial-sync.requested";
const GMAIL_CONNECTED_EVENT = "sync/gmail.connected";

type GmailSyncEventData = {
	userId: string;
	accountId: string;
	pageToken?: string | null;
	loadedCount?: number;
};

type GmailMessagePart = {
	mimeType?: string;
	headers?: Array<{
		name?: string;
		value?: string;
	}>;
	body?: {
		data?: string;
		attachmentId?: string;
	};
	parts?: GmailMessagePart[];
};

type GmailMessage = {
	id?: string;
	threadId?: string;
	snippet?: string;
	internalDate?: Date | string | number | null;
	payload?: GmailMessagePart;
	raw?: string;
};

function decodeBase64Url(value: string) {
	const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
	return Buffer.from(padded, "base64").toString("utf8");
}

function normalizeWhitespace(value: string) {
	return value.replace(/\s+/g, " ").trim();
}

function collectTextParts(part?: GmailMessagePart): string[] {
	if (!part) {
		return [];
	}

	const collected: string[] = [];
	const bodyData = part.body?.data;

	if (bodyData && part.mimeType?.startsWith("text/")) {
		const decoded = decodeBase64Url(bodyData);
		const text =
			part.mimeType === "text/html"
				? decoded.replace(/<[^>]+>/g, " ")
				: decoded;
		const normalized = normalizeWhitespace(text);
		if (normalized) {
			collected.push(normalized);
		}
	}

	for (const child of part.parts ?? []) {
		collected.push(...collectTextParts(child));
	}

	return collected;
}

function getHeaderValue(
	part: GmailMessagePart | undefined,
	headerName: string,
) {
	const header = part?.headers?.find(
		(item) => item.name?.toLowerCase() === headerName.toLowerCase(),
	);
	return header?.value?.trim() ?? "";
}

function toDate(value: GmailMessage["internalDate"]) {
	if (value instanceof Date) {
		return value;
	}

	if (typeof value === "string" || typeof value === "number") {
		const date = new Date(value);
		if (!Number.isNaN(date.getTime())) {
			return date;
		}
	}

	return new Date();
}

function hasAttachment(part?: GmailMessagePart): boolean {
	if (!part) {
		return false;
	}

	if (part.body?.attachmentId) {
		return true;
	}

	if (
		(part.body?.data && part.mimeType?.startsWith("text/")) ||
		part.headers?.some(
			(item) =>
				item.name === "Content-Disposition" &&
				item.value?.includes("attachment"),
		)
	) {
		return true;
	}

	return (part.parts ?? []).some((child) => hasAttachment(child));
}

function detectSignals(content: string) {
	const lowered = content.toLowerCase();
	const hasMeetingSignal =
		/\b(meeting|calendar invite|zoom|teams|google meet|call)\b/.test(lowered);
	const hasDeadline =
		/\b(deadline|due\s+(?:by|on)|asap|end of day|eod|tomorrow|today)\b/.test(
			lowered,
		);
	const hasInvoice =
		/\b(invoice|bill|payment|receipt|subscription renewal)\b/.test(lowered);

	let importance: "low" | "medium" | "high" = "medium";
	if (
		hasDeadline ||
		hasInvoice ||
		/\b(urgent|immediately|action required|priority)\b/.test(lowered)
	) {
		importance = "high";
	} else if (
		/\b(fyi|for your information|newsletter|promotion)\b/.test(lowered)
	) {
		importance = "low";
	}

	return {
		hasMeetingSignal,
		hasDeadline,
		hasInvoice,
		importance,
	};
}

function buildAnalysisText(message: GmailMessage) {
	const subject = getHeaderValue(message.payload, "Subject");
	const fromAddress = getHeaderValue(message.payload, "From");
	const bodyText = collectTextParts(message.payload).join("\n");
	const fallbackSnippet = normalizeWhitespace(message.snippet ?? "");
	const summarySource = normalizeWhitespace(
		[
			subject && `Subject: ${subject}`,
			fromAddress && `From: ${fromAddress}`,
			fallbackSnippet && `Snippet: ${fallbackSnippet}`,
			bodyText && `Body: ${bodyText}`,
		]
			.filter(Boolean)
			.join("\n"),
	);

	return summarySource || "No email body was available.";
}

function buildMessageChunks(input: {
	summary: string;
	bodyText: string;
	embedding: number[];
	emailId: string;
	accountId: string;
	emailDate: Date;
}) {
	return [
		{
			emailId: input.emailId,
			accountId: input.accountId,
			chunkType: "summary" as const,
			content: input.summary,
			embedding: input.embedding,
			emailDate: input.emailDate,
		},
		{
			emailId: input.emailId,
			accountId: input.accountId,
			chunkType: "body" as const,
			content: input.bodyText,
			embedding: input.embedding,
			emailDate: input.emailDate,
		},
	];
}

type GmailSyncStep = {
	run<T>(id: string, fn: () => Promise<T>): Promise<T>;
	sendEvent<T = unknown>(
		id: string,
		payload: { name: string; data: GmailSyncEventData },
	): Promise<T>;
};

type GmailSyncHandlerContext = {
	event: { data: GmailSyncEventData };
	step: GmailSyncStep;
};

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export const gmailInitialSyncMail = inngest.createFunction(
	{
		id: "sync-gmail-initial-mail",
		triggers: [{ event: GMAIL_CONNECTED_EVENT }, { event: GMAIL_SYNC_EVENT }],
	},
	async ({ event, step }: GmailSyncHandlerContext) => {
		const data = event.data as GmailSyncEventData;
		const loadedCount = data.loadedCount ?? 0;
		const gmailClient = corsair.withTenant(data.userId);

		const account = await step.run(
			`load-user-plan-${data.userId}`,
			async () => {
				const [row] = await db
					.select({ plan: user.plan })
					.from(user)
					.where(eq(user.id, data.userId))
					.limit(1);

				if (!row) {
					throw new Error(`Unable to load user plan for ${data.userId}`);
				}

				return row;
			},
		);

		const plan = account.plan as keyof typeof PLANS;
		const maxEmails = PLANS[plan].maxEmails;
		const remaining = Math.max(maxEmails - loadedCount, 0);

		if (remaining === 0) {
			return { loadedCount, maxEmails, completed: true };
		}

		const batchSize = Math.min(INITIAL_BATCH_SIZE, remaining);

		const page = await step.run(
			`list-gmail-messages-${data.accountId}-${loadedCount}`,
			async () => {
				return gmailClient.gmail.api.messages.list({
					maxResults: batchSize,
					pageToken: data.pageToken ?? undefined,
					includeSpamTrash: false,
				});
			},
		);

		const messages = (page.messages ?? []).filter(
			(message: { id?: string } | undefined): message is GmailMessage =>
				Boolean(message?.id),
		);

		let processedCount = 0;

		for (const message of messages) {
			if (processedCount >= batchSize) {
				break;
			}

			const messageId = message.id;
			if (!messageId) {
				continue;
			}

			await step.run(
				`sync-gmail-message-${data.accountId}-${messageId}`,
				async () => {
					const fullMessage = (await gmailClient.gmail.api.messages.get({
						id: messageId,
						format: "full",
					})) as GmailMessage;

					const text = buildAnalysisText(fullMessage);
					const [analysis, bodyText] = await Promise.all([
						generateSummaryAndEmbeddings(text),
						Promise.resolve(
							normalizeWhitespace(
								collectTextParts(fullMessage.payload).join("\n") ||
									fullMessage.snippet ||
									text,
							),
						),
					]);

					const subject = getHeaderValue(fullMessage.payload, "Subject");
					const fromAddress = getHeaderValue(fullMessage.payload, "From");
					const emailDate = toDate(fullMessage.internalDate);
					const signals = detectSignals(`${text}\n${analysis.summary}`);
					const embedding =
						analysis.embedding.length > 0
							? analysis.embedding
							: new Array(1536).fill(0);

					await db.transaction(async (tx: DbTransaction) => {
						await tx
							.delete(emailChunks)
							.where(eq(emailChunks.emailId, messageId));

						await tx
							.insert(emailAiMetadata)
							.values({
								emailId: messageId,
								accountId: data.accountId,
								threadId: fullMessage.threadId ?? null,
								subject: subject || null,
								fromAddress: fromAddress || null,
								summary: analysis.summary,
								actionItems: null,
								entities: null,
								importance: signals.importance,
								category: null,
								hasMeetingSignal: signals.hasMeetingSignal,
								hasDeadline: signals.hasDeadline,
								hasInvoice: signals.hasInvoice,
								hasAttachment: hasAttachment(fullMessage.payload),
								emailDate,
							})
							.onConflictDoUpdate({
								target: emailAiMetadata.emailId,
								set: {
									accountId: data.accountId,
									threadId: fullMessage.threadId ?? null,
									subject: subject || null,
									fromAddress: fromAddress || null,
									summary: analysis.summary,
									actionItems: null,
									entities: null,
									importance: signals.importance,
									category: null,
									hasMeetingSignal: signals.hasMeetingSignal,
									hasDeadline: signals.hasDeadline,
									hasInvoice: signals.hasInvoice,
									hasAttachment: hasAttachment(fullMessage.payload),
									emailDate,
								},
							});

						await tx.insert(emailChunks).values(
							buildMessageChunks({
								summary: analysis.summary,
								bodyText,
								embedding,
								emailId: messageId,
								accountId: data.accountId,
								emailDate,
							}),
						);
					});
				},
			);

			processedCount += 1;
		}

		const nextPageToken = page.nextPageToken;
		const nextLoadedCount = loadedCount + processedCount;

		if (nextPageToken && nextLoadedCount < maxEmails) {
			await step.sendEvent(
				`enqueue-gmail-sync-${data.accountId}-${nextLoadedCount}`,
				{
					name: GMAIL_SYNC_EVENT,
					data: {
						userId: data.userId,
						accountId: data.accountId,
						pageToken: nextPageToken,
						loadedCount: nextLoadedCount,
					},
				},
			);
		}

		return {
			loadedCount: nextLoadedCount,
			maxEmails,
			completed: !nextPageToken || nextLoadedCount >= maxEmails,
		};
	},
);
