"use client";

import {
	Archive03Icon,
	ArrowLeft02Icon,
	SearchIcon,
	StarIcon,
	Trash,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import he from "he";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import removeMarkdown from "remove-markdown";
import { ReplySheet } from "@/components/features/inbox/reply-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button-2";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

interface MessagePartHeader {
	name: string;
	value: string;
}

interface MessagePartBody {
	data?: string;
	size?: number;
}

interface MessagePart {
	partId?: string;
	mimeType?: string;
	filename?: string;
	headers?: MessagePartHeader[];
	body?: MessagePartBody;
	parts?: MessagePart[];
}

function decodeBase64Url(str: string) {
	try {
		return decodeURIComponent(
			atob(str.replace(/-/g, "+").replace(/_/g, "/"))
				.split("")
				.map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
				.join(""),
		);
	} catch (_e) {
		return "";
	}
}

function getEmailBody(payload: MessagePart | undefined): {
	type: "html" | "plain";
	content: string;
} {
	if (!payload) return { type: "plain", content: "" };

	if (payload.body?.data) {
		return {
			type: payload.mimeType === "text/html" ? "html" : "plain",
			content: decodeBase64Url(payload.body.data),
		};
	}

	if (payload.parts) {
		const htmlPart = payload.parts.find((p) => p.mimeType === "text/html");
		if (htmlPart?.body?.data) {
			return { type: "html", content: decodeBase64Url(htmlPart.body.data) };
		}
		const textPart = payload.parts.find((p) => p.mimeType === "text/plain");
		if (textPart?.body?.data) {
			return { type: "plain", content: decodeBase64Url(textPart.body.data) };
		}
		for (const part of payload.parts) {
			if (part.parts) {
				const result = getEmailBody(part);
				if (result.content) return result;
			}
		}
	}
	return { type: "plain", content: "" };
}

export function MailLayout({ labelId = "INBOX" }: { labelId?: string }) {
	const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
	const { ref: mobileRef, inView: mobileInView } = useInView({
		rootMargin: "400px",
	});
	const { ref: desktopRef, inView: desktopInView } = useInView({
		rootMargin: "400px",
	});
	const inView = mobileInView || desktopInView;

	const {
		data,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = api.gmail.getAllMails.useInfiniteQuery(
		{ limit: 20, labelId },
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialCursor: null as number | null,
		},
	);

	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const selectedMailId = searchParams.get("mailId");

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	const setSelectedMailId = useCallback(
		(id: string | null) => {
			const params = new URLSearchParams(searchParams.toString());
			if (id) {
				params.set("mailId", id);
			} else {
				params.delete("mailId");
			}
			router.push(`${pathname}?${params.toString()}`);
		},
		[searchParams, pathname, router],
	);

	const allMails = data?.pages.flatMap((page) => page.items) || [];

	const filteredData = allMails.filter((message: Record<string, unknown>) => {
		if (filter === "all") return true;
		const labelIds = (message.labelIds as string[]) || [];
		const isUnread = labelIds.includes("UNREAD");
		return filter === "read" ? !isUnread : isUnread;
	});

	useEffect(() => {
		if (filteredData && filteredData.length > 0) {
			if (
				!filteredData.find(
					(m: Record<string, unknown>) => m.id === selectedMailId,
				)
			) {
				if (window.innerWidth >= 1024) {
					setSelectedMailId(filteredData[0].id as string);
				} else if (selectedMailId !== null) {
					setSelectedMailId(null);
				}
			}
		} else {
			if (selectedMailId !== null) {
				setSelectedMailId(null);
			}
		}
	}, [filteredData, selectedMailId, setSelectedMailId]);

	if (isLoading)
		return (
			<div className="flex h-full w-full items-center justify-center p-4">
				<Spinner />
			</div>
		);
	if (error)
		return (
			<div className="flex h-full w-full items-center justify-center p-4 text-red-500">
				Error: {error.message}
			</div>
		);

	const selectedMail = filteredData?.find(
		(m: Record<string, unknown>) => m.id === selectedMailId,
	);
	let selectedBody = { type: "plain", content: "Loading..." };
	let selectedSubject = "No Subject";
	let selectedFromName = "Unknown Sender";
	let selectedFromEmail = "";
	let selectedTo = "Unknown";
	let selectedCc = "";
	let selectedDate = "Unknown Date";
	let _isImportant = false;

	if (selectedMail?.payload) {
		const payload = selectedMail.payload as MessagePart;
		selectedBody = getEmailBody(payload);
		_isImportant = ((selectedMail.labelIds as string[]) || []).includes(
			"IMPORTANT",
		);

		if (payload.headers) {
			const subjectHeader = payload.headers.find(
				(h) => h.name.toLowerCase() === "subject",
			);
			if (subjectHeader) selectedSubject = subjectHeader.value;

			const fromHeader = payload.headers.find(
				(h) => h.name.toLowerCase() === "from",
			);
			if (fromHeader) {
				const match = fromHeader.value.match(/^"?([^"<]+)"?\s*<([^>]+)>$/);
				if (match) {
					selectedFromName = match[1]?.trim() || "";
					selectedFromEmail = match[2]?.trim() || "";
				} else {
					selectedFromName = fromHeader.value;
				}
			}

			const toHeader = payload.headers.find(
				(h) => h.name.toLowerCase() === "to",
			);
			if (toHeader) selectedTo = toHeader.value;

			const ccHeader = payload.headers.find(
				(h) => h.name.toLowerCase() === "cc",
			);
			if (ccHeader) selectedCc = ccHeader.value;

			const dateHeader = payload.headers.find(
				(h) => h.name.toLowerCase() === "date",
			);
			if (dateHeader) {
				selectedDate = new Date(dateHeader.value).toLocaleString();
			}
		}
	}

	const renderLeftPanel = (observerRef: (node?: Element | null) => void) => (
		<div className="flex h-full min-h-0 min-w-[320px] flex-col gap-2 overflow-hidden p-2">
			{labelId === "INBOX" && (
				<div className="flex w-full items-center justify-end">
					<Tabs
						className="w-auto"
						defaultValue="read"
						onValueChange={(val) => setFilter(val as "all" | "read" | "unread")}
						value={filter}
					>
						<TabsList className="h-8 border bg-muted/30 p-1">
							<TabsTrigger className="px-3 py-1 text-xs" value="all">
								All
							</TabsTrigger>
							<TabsTrigger className="px-3 py-1 text-xs" value="read">
								Read
							</TabsTrigger>
							<TabsTrigger className="px-3 py-1 text-xs" value="unread">
								Unread
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			)}
			<InputGroup className="mb-2 shrink-0 has-[[data-slot=input-group-control]:focus-visible]:border-input has-[[data-slot=input-group-control]:focus-visible]:ring-0">
				<InputGroupAddon>
					<HugeiconsIcon icon={SearchIcon} />
				</InputGroupAddon>
				<InputGroupInput className="w-full" />
			</InputGroup>
			<div className="-mx-2 min-h-0 flex-1 overflow-y-auto px-2">
				<div className="flex flex-col gap-2 pb-4">
					{filteredData?.length === 0 ? (
						<div className="p-4 text-center text-muted-foreground text-sm">
							No emails found.
						</div>
					) : null}
					{filteredData?.map((message: Record<string, unknown>) => {
						const payload = message.payload as
							| { headers?: Array<{ name: string; value: string }> }
							| undefined;

						let subject = "No Subject";
						let from = "Unknown Sender";
						let date = "Unknown Date";

						if (payload?.headers) {
							const subjectHeader = payload.headers.find(
								(h) => h.name.toLowerCase() === "subject",
							);
							if (subjectHeader) subject = subjectHeader.value;

							const fromHeader = payload.headers.find(
								(h) => h.name.toLowerCase() === "from",
							);
							if (fromHeader) {
								const match = fromHeader.value.match(/^"?([^"<]+)"?\s*<.*>$/);
								from = match
									? match[1]?.trim() || fromHeader.value
									: fromHeader.value;
							}

							const dateHeader = payload.headers.find(
								(h) => h.name.toLowerCase() === "date",
							);
							if (dateHeader)
								date = new Date(dateHeader.value).toLocaleDateString();
						}

						const isActive = selectedMailId === message.id;

						const snippetText = message.snippet
							? removeMarkdown(he.decode(message.snippet as string))
							: "No content";

						const labelIds = (message.labelIds as string[]) || [];
						const _isStarred = labelIds.includes("STARRED");
						const hiddenLabels = [
							"UNREAD",
							"INBOX",
							"SENT",
							"DRAFT",
							"SPAM",
							"TRASH",
							"STARRED",
							"YELLOW_STAR",
						];
						const displayLabels = labelIds
							.filter((l) => !hiddenLabels.includes(l))
							.map((l) =>
								l.startsWith("CATEGORY_")
									? l.replace("CATEGORY_", "").toLowerCase()
									: l.toLowerCase(),
							);

						return (
							<button
								className={cn(
									"flex w-full cursor-pointer flex-col items-start gap-2 rounded-lg border p-3 text-left font-geist-sans text-sm transition-all hover:bg-accent/50",
									isActive ? "bg-accent/50" : "bg-background",
								)}
								key={message.id as string}
								onClick={() => setSelectedMailId(message.id as string)}
								type="button"
							>
								<div className="flex w-full flex-col gap-1">
									<div className="flex items-center">
										<div className="flex items-center gap-2">
											<div className="font-semibold text-sm">{from}</div>
										</div>
										<div
											className={cn(
												"ml-auto text-xs",
												isActive ? "text-foreground" : "text-muted-foreground",
											)}
										>
											{date}
										</div>
									</div>
									<div className="font-medium text-xs">{subject}</div>
								</div>
								<div className="line-clamp-2 w-full text-left text-muted-foreground text-xs">
									{snippetText}
								</div>
								{labelId === "INBOX" && displayLabels.length > 0 && (
									<div className="mt-2 flex flex-wrap items-center gap-2">
										{displayLabels.map((label, idx) => (
											<Badge
												key={label}
												variant={
													isActive && idx === 0 ? "default" : "secondary"
												}
											>
												{label}
											</Badge>
										))}
									</div>
								)}
							</button>
						);
					})}
					{hasNextPage && (
						<div
							className="flex h-16 items-center justify-center text-muted-foreground text-sm"
							ref={observerRef}
						>
							{isFetchingNextPage ? (
								<>
									<Spinner className="mr-2 size-4" />
									Loading...
								</>
							) : (
								<span className="opacity-50">Scroll for more</span>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);

	const rightPanelContent = selectedMail ? (
		<div className="relative flex h-full flex-col overflow-hidden">
			<div className="flex shrink-0 items-center justify-between border-b px-3 py-2">
				<div className="flex items-center gap-1">
					<Button
						className="mr-2 h-9 w-9 shrink-0 lg:hidden"
						onClick={() => setSelectedMailId(null)}
						size="icon"
						variant="ghost"
					>
						<HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
					</Button>
					<Button size="icon-sm" variant="ghost">
						<HugeiconsIcon icon={Trash} />
					</Button>
					<Button size="icon-sm" variant="ghost">
						<HugeiconsIcon icon={Archive03Icon} />
					</Button>
				</div>
			</div>

			<div className="flex shrink-0 flex-col">
				<div className="flex items-start justify-between gap-4 p-4">
					<h2 className="wrap-break-word font-sans font-semibold text-lg">
						{selectedSubject}
					</h2>
					<div className="mt-1 whitespace-nowrap text-muted-foreground text-xs">
						{selectedDate}
					</div>
				</div>

				<div className="flex items-start justify-between gap-4 border-b p-4 pt-0">
					<div className="flex min-w-0 flex-1 items-center gap-3">
						<div className="flex min-w-0 flex-1 flex-col">
							<div className="flex items-center gap-2">
								<span className="truncate font-semibold text-xs">
									{selectedFromName}
								</span>
								<span className="truncate text-muted-foreground text-xs">
									{selectedFromEmail}
								</span>
							</div>
							<div className="mt-0.5 line-clamp-1 break-all text-[10px] text-muted-foreground">
								To: {selectedTo}{" "}
								{selectedCc && (
									<>
										<span className="mx-1">•</span> Cc: {selectedCc}
									</>
								)}
							</div>
						</div>
					</div>
					<div className="flex items-center gap-1">
						<Button size="icon-sm" variant="ghost">
							<HugeiconsIcon icon={StarIcon} />
						</Button>
					</div>
				</div>
			</div>

			{selectedBody.type === "html" ? (
				<div className="flex min-h-0 w-full flex-1 justify-center bg-white">
					<iframe
						className="h-full w-full max-w-4xl border-none bg-white p-4 sm:p-6 lg:p-8"
						sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
						srcDoc={selectedBody.content}
						title="Email Content"
					/>
				</div>
			) : (
				<ScrollArea className="min-h-0 flex-1 bg-white dark:bg-zinc-950">
					<div className="p-6">
						<div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
							{selectedBody.content ||
								(selectedMail.snippet as string) ||
								"No content available."}
						</div>
					</div>
				</ScrollArea>
			)}
			<div className="flex shrink-0 items-center justify-end border-t bg-background px-4 py-3">
				<ReplySheet
					subject={selectedSubject}
					toEmail={selectedFromEmail}
					toName={selectedFromName}
					trigger={
						<Button animation="none" variant="secondary">
							Reply
						</Button>
					}
				/>
			</div>
		</div>
	) : (
		<div className="flex h-full items-center justify-center font-geist-sans text-muted-foreground">
			{filteredData?.length === 0 ? "" : "Select an email to view its contents"}
		</div>
	);

	return (
		<div className="absolute inset-0 flex overflow-hidden">
			{/* Mobile Layout */}
			<div className="flex h-full min-h-0 w-full lg:hidden">
				{!selectedMailId ? (
					<div className="flex h-full min-h-0 w-full flex-col">
						{renderLeftPanel(mobileRef)}
					</div>
				) : (
					<div className="flex h-full min-h-0 w-full flex-col">
						{rightPanelContent}
					</div>
				)}
			</div>

			{/* Desktop Layout */}
			<div className="hidden h-full w-full lg:flex">
				<ResizablePanelGroup className="h-full w-full" orientation="horizontal">
					<ResizablePanel
						className="min-w-[384px]"
						defaultSize={450}
						maxSize={576}
						minSize={384}
					>
						{renderLeftPanel(desktopRef)}
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel className="flex h-full flex-col">
						{rightPanelContent}
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
}
