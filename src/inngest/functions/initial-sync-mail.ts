import { Buffer } from "node:buffer";
import { eq } from "drizzle-orm";
import { corsair } from "@/corsair";
import { inngest } from "@/inngest/client";
import { ExtraInformationFromEmail } from "@/lib/openai";
import { PLANS } from "@/lib/plans";
import { db } from "@/server/db";
import { emailAiMetadata, emailChunks, user } from "@/server/db/schema";

const INITIAL_BATCH_SIZE = 10;
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
	actionItems: string[];
	entities: {
		persons: string[];
		organizations: string[];
		locations: string[];
		dates: string[];
		amounts: string[];
	} | null;
	embedding: number[];
	emailId: string;
	accountId: string;
	emailDate: Date;
}) {
	const chunks: {
		emailId: string;
		accountId: string;
		chunkType: "summary" | "body" | "action_items" | "entities";
		content: string;
		embedding: number[];
		emailDate: Date;
	}[] = [
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

	if (input.actionItems && input.actionItems.length > 0) {
		chunks.push({
			emailId: input.emailId,
			accountId: input.accountId,
			chunkType: "action_items" as const,
			content: input.actionItems.join("\n"),
			embedding: input.embedding,
			emailDate: input.emailDate,
		});
	}

	if (input.entities) {
		const entitiesText = Object.entries(input.entities)
			.map(([key, values]) =>
				values.length > 0 ? `${key}: ${values.join(", ")}` : "",
			)
			.filter(Boolean)
			.join("\n");

		if (entitiesText) {
			chunks.push({
				emailId: input.emailId,
				accountId: input.accountId,
				chunkType: "entities" as const,
				content: entitiesText,
				embedding: input.embedding,
				emailDate: input.emailDate,
			});
		}
	}

	return chunks;
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

const immediateGmailSyncStep: GmailSyncStep = {
	run: async (_id, fn) => fn(),
	sendEvent: async <T = unknown>(_id: string, payload: { name: string }) => {
		console.warn(
			"[sync/gmail] Skipping follow-up page enqueue because Inngest is unavailable:",
			payload.name,
		);
		return undefined as T;
	},
};

export async function runGmailInitialSync(
	data: GmailSyncEventData,
	step: GmailSyncStep = immediateGmailSyncStep,
) {
	const loadedCount = data.loadedCount ?? 0;
	const gmailClient = corsair.withTenant(data.userId);

	const account = await step.run(`load-user-plan-${data.userId}`, async () => {
		const [row] = await db
			.select({ plan: user.plan })
			.from(user)
			.where(eq(user.id, data.userId))
			.limit(1);

		if (!row) {
			throw new Error(`Unable to load user plan for ${data.userId}`);
		}

		return row;
	});

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
				let fullMessage: GmailMessage;
				try {
					fullMessage = (await gmailClient.gmail.api.messages.get({
						id: messageId,
						format: "full",
					})) as GmailMessage;
				} catch (err) {
					const e = err as { status?: number; message?: string };
					if (e?.status === 404 || e?.message?.includes("Not Found")) {
						console.warn(
							`[Gmail Sync] Message ${messageId} not found, skipping.`,
						);
						return;
					}
					throw err;
				}

				const text = buildAnalysisText(fullMessage);
				const [analysis, bodyText] = await Promise.all([
					ExtraInformationFromEmail(text),
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
							summary: analysis.information.summary,
							actionItems: analysis.information.actionItems || null,
							entities: analysis.information.entities || null,
							importance: analysis.information.importance || "medium",
							priorityScore: analysis.information.priorityScore || 50,
							category: analysis.information.category || null,
							hasMeetingSignal: analysis.information.hasMeetingSignal ?? false,
							hasDeadline: analysis.information.hasDeadline ?? false,
							hasInvoice: analysis.information.hasInvoice ?? false,
							hasAttachment:
								analysis.information.hasAttachment ??
								hasAttachment(fullMessage.payload),
							emailDate,
						})
						.onConflictDoUpdate({
							target: emailAiMetadata.emailId,
							set: {
								accountId: data.accountId,
								threadId: fullMessage.threadId ?? null,
								subject: subject || null,
								fromAddress: fromAddress || null,
								summary: analysis.information.summary,
								actionItems: analysis.information.actionItems || null,
								entities: analysis.information.entities || null,
								importance: analysis.information.importance || "medium",
								priorityScore: analysis.information.priorityScore || 50,
								category: analysis.information.category || null,
								hasMeetingSignal:
									analysis.information.hasMeetingSignal ?? false,
								hasDeadline: analysis.information.hasDeadline ?? false,
								hasInvoice: analysis.information.hasInvoice ?? false,
								hasAttachment:
									analysis.information.hasAttachment ??
									hasAttachment(fullMessage.payload),
								emailDate,
							},
						});

					await tx.insert(emailChunks).values(
						buildMessageChunks({
							summary: analysis.information.summary,
							bodyText,
							actionItems: analysis.information.actionItems,
							entities: analysis.information.entities,
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
}

export const gmailInitialSyncMail = inngest.createFunction(
	{
		id: "sync-gmail-initial-mail",
		triggers: [{ event: GMAIL_CONNECTED_EVENT }, { event: GMAIL_SYNC_EVENT }],
	},
	async ({ event, step }: GmailSyncHandlerContext) => {
		return runGmailInitialSync(event.data as GmailSyncEventData, step);
	},
);
