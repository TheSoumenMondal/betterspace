import { useMemo, useState } from "react";
import { mockEmails } from "@/lib/mock-data";

// biome-ignore lint/suspicious/noExplicitAny: demo purposes
export function useDemoMail(queryParams: any) {
	const [mails, setMails] = useState(mockEmails);

	const filteredMails = useMemo(() => {
		let result = mails;

		if (queryParams.labelId) {
			result = result.filter((m) => m.labelIds.includes(queryParams.labelId));
		}

		if (queryParams.isUnread !== undefined) {
			result = result.filter((m) =>
				queryParams.isUnread
					? m.labelIds.includes("UNREAD")
					: !m.labelIds.includes("UNREAD"),
			);
		}

		if (queryParams.importance && queryParams.importance.length > 0) {
			result = result.filter((m) =>
				queryParams.importance.includes(m.aiMetadata.importance),
			);
		}

		if (queryParams.hasMeetingSignal)
			result = result.filter((m) => m.aiMetadata.hasMeetingSignal);
		if (queryParams.hasDeadline)
			result = result.filter((m) => m.aiMetadata.hasDeadline);
		if (queryParams.hasInvoice)
			result = result.filter((m) => m.aiMetadata.hasInvoice);
		if (queryParams.hasAttachment)
			result = result.filter((m) => m.aiMetadata.hasAttachment);

		// Sort
		if (queryParams.sort === "oldest") {
			result = [...result].reverse();
		} else if (queryParams.sort === "priorityDesc") {
			result = [...result].sort(
				(a, b) =>
					(b.aiMetadata.priorityScore || 0) - (a.aiMetadata.priorityScore || 0),
			);
		} else if (queryParams.sort === "priorityAsc") {
			result = [...result].sort(
				(a, b) =>
					(a.aiMetadata.priorityScore || 0) - (b.aiMetadata.priorityScore || 0),
			);
		}

		return result;
	}, [mails, queryParams]);

	// Fake pagination
	const [pageCount, setPageCount] = useState(1);

	const paginatedMails = useMemo(() => {
		return filteredMails.slice(0, pageCount * 20);
	}, [filteredMails, pageCount]);

	const hasNextPage = pageCount * 20 < filteredMails.length;

	const data = {
		pages: [{ items: paginatedMails }],
	};

	const fetchNextPage = () => {
		if (hasNextPage) setPageCount((p) => p + 1);
	};

	const markAsRead = (id: string) => {
		setMails((prev) =>
			prev.map((m) => {
				if (m.id === id) {
					return { ...m, labelIds: m.labelIds.filter((l) => l !== "UNREAD") };
				}
				return m;
			}),
		);
	};

	const toggleStar = (id: string, starred: boolean) => {
		setMails((prev) =>
			prev.map((m) => {
				if (m.id === id) {
					const labels = m.labelIds.filter((l) => l !== "STARRED");
					if (starred) labels.push("STARRED");
					return { ...m, labelIds: labels };
				}
				return m;
			}),
		);
	};

	const trashMail = (id: string) => {
		setMails((prev) =>
			prev.map((m) => {
				if (m.id === id) {
					return {
						...m,
						labelIds: [
							"TRASH",
							...m.labelIds.filter((l) => l !== "INBOX" && l !== "SENT"),
						],
					};
				}
				return m;
			}),
		);
	};

	const archiveMail = (id: string) => {
		setMails((prev) =>
			prev.map((m) => {
				if (m.id === id) {
					return { ...m, labelIds: m.labelIds.filter((l) => l !== "INBOX") };
				}
				return m;
			}),
		);
	};

	return {
		data,
		isLoading: false,
		error: null as Error | null,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage: false,
		markAsRead,
		toggleStar,
		trashMail,
		archiveMail,
	};
}
