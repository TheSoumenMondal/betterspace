"use client";

import {
	AiBrain01Icon,
	Alert01Icon,
	Calendar01Icon,
	Calendar03Icon,
	CommandIcon,
	ComputerIcon,
	Delete02Icon,
	Mail01Icon,
	Moon02Icon,
	Note01Icon,
	PencilEdit01Icon,
	Search01Icon,
	SentIcon,
	Settings01Icon,
	SlidersHorizontalIcon,
	StarIcon,
	Sun03Icon,
	Tap01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button-2";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/better-auth/client";
import { api } from "@/trpc/react";
import { Kbd, KbdGroup } from "./kbd";
import { Spinner } from "./spinner";

type Mode = "search" | "advanced" | "actions";
const MODES: Mode[] = ["search", "advanced", "actions"];

const MODE_META: Record<
	Mode,
	{ label: string; icon: React.ElementType; color: string }
> = {
	search: { label: "Quick Search", icon: Search01Icon, color: "text-blue-400" },
	advanced: {
		label: "Advanced",
		icon: SlidersHorizontalIcon,
		color: "text-violet-400",
	},
	actions: { label: "Actions", icon: Tap01Icon, color: "text-amber-400" },
};

/* ---------- helpers ---------- */
function getHeader(
	payload: { headers?: { name: string; value: string }[] } | undefined | null,
	name: string,
) {
	if (!payload?.headers) return "";
	return (
		payload.headers.find((h) => h.name.toLowerCase() === name.toLowerCase())
			?.value ?? ""
	);
}

function parseNaturalLanguageToGmail(input: string): string {
	let q = input.toLowerCase();
	const filters: string[] = [];

	const fromMatch = q.match(
		/from\s+([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\w+)/,
	);
	if (fromMatch) {
		filters.push(`from:(${fromMatch[1]})`);
		q = q.replace(fromMatch[0], "");
	}

	const toMatch = q.match(/to\s+([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\w+)/);
	if (toMatch) {
		filters.push(`to:(${toMatch[1]})`);
		q = q.replace(toMatch[0], "");
	}

	if (/attachment|file|document/.test(q)) {
		filters.push("has:attachment");
		q = q
			.replace(/with\s+attachments?/g, "")
			.replace(/attachments?/g, "")
			.replace(/files?/g, "")
			.replace(/documents?/g, "");
	}

	if (q.includes("last week")) {
		filters.push("newer_than:7d");
		q = q.replace("last week", "");
	} else if (q.includes("yesterday")) {
		filters.push("newer_than:2d");
		q = q.replace("yesterday", "");
	} else if (q.includes("today")) {
		filters.push("newer_than:1d");
		q = q.replace("today", "");
	} else if (q.includes("last month")) {
		filters.push("newer_than:1m");
		q = q.replace("last month", "");
	} else if (q.includes("last year")) {
		filters.push("newer_than:1y");
		q = q.replace("last year", "");
	}

	// Clean up common filler words and punctuation
	q = q
		.replace(/\b(show|find|search|get|me|emails?|mails?|messages?)\b/g, " ")
		.replace(/\?/g, " ")
		.trim();

	if (q) {
		q = q.replace(/\s+/g, " ");
		if (q.trim()) filters.push(q.trim());
	}

	// Fallback to original prompt if heuristic stripping leaves us with nothing
	const parsed = filters.join(" ");
	return parsed.trim() || input;
}

function AdvancedMode({ onClose }: { onClose: () => void }) {
	const router = useRouter();
	const [prompt, setPrompt] = React.useState("");
	const [query, setQuery] = React.useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		// Auto-focus field when mode opens
		setTimeout(() => inputRef.current?.focus(), 50);
	}, []);

	const { data, isLoading } = api.gmail.searchMails.useQuery(
		{ query, limit: 15 },
		{ enabled: query.length > 0 },
	);

	const buildAndRun = (e: React.FormEvent) => {
		e.preventDefault();
		if (!prompt.trim()) return;
		const parsedQuery = parseNaturalLanguageToGmail(prompt);
		setQuery(parsedQuery);
	};

	return (
		<div className="flex h-full flex-col">
			<form
				className="flex h-12 items-center gap-2 border-b bg-transparent px-3"
				onSubmit={buildAndRun}
			>
				<input
					className="flex h-full w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
					onChange={(e) => setPrompt(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							e.stopPropagation();
							buildAndRun(e as unknown as React.FormEvent);
						}
					}}
					placeholder="Emails from John with attachments last week"
					ref={inputRef}
					value={prompt}
				/>
				<Button
					className="h-7 shrink-0 rounded-md px-3 font-medium text-xs"
					size="sm"
					type="submit"
					variant="secondary"
				>
					Search
				</Button>
			</form>

			{/* Results */}
			<AnimatePresence>
				{(query || isLoading) && (
					<motion.div
						animate={{ height: "auto", opacity: 1 }}
						className="overflow-hidden"
						exit={{ height: 0, opacity: 0 }}
						initial={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
					>
						<div className="max-h-[22rem] overflow-y-auto p-2">
							{isLoading && (
								<div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground text-sm">
									<Spinner className="size-5 text-primary" />
									<span>Searching your emails…</span>
								</div>
							)}
							{!isLoading &&
								query &&
								(!data?.items || data.items.length === 0) && (
									<div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
										<HugeiconsIcon
											className="mb-2 text-muted-foreground/30"
											icon={Search01Icon}
											size={32}
										/>
										<p className="font-medium text-foreground text-sm">
											No results found
										</p>
										<p className="text-muted-foreground text-xs">
											Try adjusting your filters to find what you're looking
											for.
										</p>
									</div>
								)}
							{data?.items?.map(
								(mail: {
									id: string;
									payload: { headers?: { name: string; value: string }[] };
									snippet: string;
								}) => {
									const fromH = getHeader(mail.payload, "From");
									const subjectH = getHeader(mail.payload, "Subject");
									const fromName =
										fromH.split("<")[0].trim().replace(/"/g, "") || fromH;
									const initial = fromName.charAt(0).toUpperCase();

									return (
										<button
											className="group flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all hover:bg-muted/80 focus-visible:bg-muted/80 focus-visible:outline-none"
											key={mail.id}
											onClick={() => {
												onClose();
												router.push("/inbox");
											}}
											type="button"
										>
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
												{initial}
											</div>
											<div className="flex w-full min-w-0 flex-col gap-0.5">
												<div className="flex items-center justify-between gap-2">
													<span className="truncate font-semibold text-foreground text-sm transition-colors group-hover:text-primary">
														{fromName}
													</span>
												</div>
												<span className="truncate font-medium text-foreground/80 text-xs">
													{subjectH || "(No Subject)"}
												</span>
												<span className="mt-0.5 line-clamp-1 text-muted-foreground text-xs">
													{mail.snippet}
												</span>
											</div>
										</button>
									);
								},
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

/* ---------- Actions Mode ---------- */
function ActionsMode({ runCommand }: { runCommand: (fn: () => void) => void }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { setTheme } = useTheme();

	return (
		<>
			<CommandInput autoFocus placeholder="Search actions..." />
			<CommandList className="py-2">
				<CommandEmpty>No actions found.</CommandEmpty>
				<CommandGroup heading="Email">
					<CommandItem
						onSelect={() =>
							runCommand(() => {
								const params = new URLSearchParams(searchParams.toString());
								params.set("compose", "1");
								router.push(`${pathname}?${params.toString()}`);
							})
						}
					>
						<HugeiconsIcon className="mr-1" icon={PencilEdit01Icon} size={8} />
						<span className="font-medium font-sans text-xs">Compose Email</span>
						<CommandShortcut>
							<Button size="icon-xs" variant="raised">
								N
							</Button>
						</CommandShortcut>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => router.push("/drafts"))}
					>
						<HugeiconsIcon className="mr-1" icon={Note01Icon} size={8} />
						<span className="font-medium font-sans text-xs">View Drafts</span>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => router.push("/sent"))}>
						<HugeiconsIcon className="mr-1" icon={SentIcon} size={8} />
						<span className="font-medium font-sans text-xs">View Sent</span>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => router.push("/starred"))}
					>
						<HugeiconsIcon className="mr-1" icon={StarIcon} size={8} />
						<span className="font-medium font-sans text-xs">Starred</span>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => router.push("/spam"))}>
						<HugeiconsIcon className="mr-1" icon={Alert01Icon} size={8} />
						<span className="font-medium font-sans text-xs">Spam</span>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => router.push("/trash"))}>
						<HugeiconsIcon className="mr-1" icon={Delete02Icon} size={8} />
						<span className="font-medium font-sans text-xs">Trash</span>
					</CommandItem>
				</CommandGroup>
				<CommandGroup heading="Calendar">
					<CommandItem
						onSelect={() => runCommand(() => router.push("/events?new=1"))}
					>
						<HugeiconsIcon className="mr-1" icon={Calendar03Icon} size={8} />
						<span className="font-medium font-sans text-xs">Create Event</span>
						<CommandShortcut>
							<Button size="icon-xs" variant="raised">
								E
							</Button>
						</CommandShortcut>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => router.push("/calendar"))}
					>
						<HugeiconsIcon className="mr-1" icon={Calendar01Icon} size={8} />
						<span className="font-medium font-sans text-xs">Open Calendar</span>
					</CommandItem>
				</CommandGroup>
				<CommandGroup heading="App">
					<CommandItem onSelect={() => runCommand(() => router.push("/space"))}>
						<HugeiconsIcon className="mr-1" icon={AiBrain01Icon} size={8} />
						<span className="font-medium font-sans text-xs">Open AI Space</span>
					</CommandItem>
					<CommandItem
						onSelect={() => runCommand(() => router.push("/settings"))}
					>
						<HugeiconsIcon className="mr-1" icon={Settings01Icon} size={8} />
						<span className="font-medium font-sans text-xs">Settings</span>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
						<HugeiconsIcon className="mr-1" icon={Sun03Icon} size={8} />
						<span className="font-medium font-sans text-xs">Light Theme</span>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
						<HugeiconsIcon className="mr-1" icon={Moon02Icon} size={8} />
						<span className="font-medium font-sans text-xs">Dark Theme</span>
					</CommandItem>
					<CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
						<HugeiconsIcon className="mr-1" icon={ComputerIcon} size={8} />
						<span className="font-medium font-sans text-xs">System Theme</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</>
	);
}

/* ---------- Main Component ---------- */
export function CommandMenu() {
	const [open, setOpen] = React.useState(false);
	const [mode, setMode] = React.useState<Mode>("search");
	const router = useRouter();
	const { data: session } = authClient.useSession();
	const isFreeUser = session?.user?.plan === "free" || !session?.user?.plan;

	// Open/close ⌘K
	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	// Reset mode on close
	React.useEffect(() => {
		if (!open) setMode("search");
	}, [open]);

	const runCommand = React.useCallback((command: () => unknown) => {
		setOpen(false);
		command();
	}, []);

	const _meta = MODE_META[mode];

	return (
		<>
			<Button
				className="relative h-8 w-8 rounded-[0.5rem] bg-muted/50 px-0 font-normal text-muted-foreground text-sm shadow-none md:w-40 md:justify-start md:px-3 md:pr-12 lg:w-56"
				onClick={() => setOpen(true)}
				size="sm"
				variant="outline"
			>
				<span className="hidden truncate md:inline-flex">Search...</span>
				<HugeiconsIcon className="size-4 md:hidden" icon={Search01Icon} />
				<KbdGroup className="hidden md:absolute md:top-[0.3rem] md:right-[0.3rem] md:flex">
					<Kbd>
						<HugeiconsIcon icon={CommandIcon} />
					</Kbd>
					<Kbd>K</Kbd>
				</KbdGroup>
			</Button>

			<CommandDialog onOpenChange={setOpen} open={open}>
				<div
					className="flex h-full w-full flex-col"
					onKeyDownCapture={(e) => {
						if (e.key === "Tab") {
							e.preventDefault();
							e.stopPropagation();
							setMode((prev) => {
								let idx = MODES.indexOf(prev);
								let nextMode = MODES[(idx + 1) % MODES.length] ?? "search";
								if (nextMode === "advanced" && isFreeUser) {
									idx = MODES.indexOf(nextMode);
									nextMode = MODES[(idx + 1) % MODES.length] ?? "search";
								}
								return nextMode;
							});
						}
					}}
				>
					{/* Mode indicator bar */}
					<div className="no-scrollbar flex items-center gap-1 overflow-x-auto border-b px-2 py-2 sm:gap-2 sm:px-3 sm:py-3">
						{MODES.map((m) => {
							const mm = MODE_META[m];
							const isActive = m === mode;
							return (
								<button
									className={cn(
										"flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 font-medium text-xs transition-colors sm:px-3 sm:py-1.5 sm:text-sm",
										isActive
											? "bg-muted text-foreground"
											: "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
										m === "advanced" &&
											isFreeUser &&
											"cursor-not-allowed opacity-50 hover:bg-transparent hover:text-muted-foreground",
									)}
									disabled={m === "advanced" && isFreeUser}
									key={m}
									onClick={() => {
										if (m === "advanced" && isFreeUser) return;
										setMode(m);
									}}
									type="button"
								>
									<HugeiconsIcon
										className={
											isActive && (!isFreeUser || m !== "advanced")
												? mm.color
												: ""
										}
										icon={mm.icon}
										size={14}
									/>
									{mm.label}
									{m === "advanced" && isFreeUser && (
										<span className="ml-1 rounded bg-muted-foreground/20 px-1 py-0.5 font-bold text-[9px] text-muted-foreground uppercase tracking-wider">
											Pro
										</span>
									)}
								</button>
							);
						})}
						<span className="ml-auto hidden shrink-0 items-center gap-1 text-[11px] text-muted-foreground/60 sm:flex">
							<kbd className="rounded border px-1.5 py-0.5 font-mono text-[11px]">
								Tab
							</kbd>
							to switch
						</span>
					</div>

					{/* Content changes per mode */}
					<div>
						{mode === "search" && (
							<>
								<CommandInput autoFocus placeholder="Search for anything…" />
								<CommandList className="py-2">
									<CommandEmpty>No results found.</CommandEmpty>
									<CommandGroup>
										<CommandItem
											onSelect={() => runCommand(() => router.push("/space"))}
										>
											<HugeiconsIcon
												className="mr-1"
												icon={AiBrain01Icon}
												size={8}
											/>
											<span className="font-medium font-sans text-xs">
												New Chat
											</span>
											<CommandShortcut>
												<Button size="icon-xs" variant="raised">
													s
												</Button>
											</CommandShortcut>
										</CommandItem>
										<CommandItem
											onSelect={() => runCommand(() => router.push("/inbox"))}
										>
											<HugeiconsIcon
												className="mr-1"
												icon={Mail01Icon}
												size={8}
											/>
											<span className="font-medium font-sans text-xs">
												Inbox
											</span>
											<CommandShortcut>
												<Button size="icon-xs" variant="raised">
													i
												</Button>
											</CommandShortcut>
										</CommandItem>
										<CommandItem
											onSelect={() =>
												runCommand(() => router.push("/calendar"))
											}
										>
											<HugeiconsIcon
												className="mr-1"
												icon={Calendar01Icon}
												size={8}
											/>
											<span className="font-medium font-sans text-xs">
												Calendar
											</span>
											<CommandShortcut>
												<Button size="icon-xs" variant="raised">
													c
												</Button>
											</CommandShortcut>
										</CommandItem>
										<CommandItem
											onSelect={() => runCommand(() => router.push("/events"))}
										>
											<HugeiconsIcon
												className="mr-1"
												icon={Calendar03Icon}
												size={8}
											/>
											<span className="font-medium font-sans text-xs">
												Events
											</span>
											<CommandShortcut>
												<Button size="icon-xs" variant="raised">
													e
												</Button>
											</CommandShortcut>
										</CommandItem>
										<CommandItem
											onSelect={() => runCommand(() => router.push("/starred"))}
										>
											<HugeiconsIcon
												className="mr-1"
												icon={StarIcon}
												size={8}
											/>
											<span className="font-medium font-sans text-xs">
												Starred
											</span>
										</CommandItem>
										<CommandItem
											onSelect={() => runCommand(() => router.push("/sent"))}
										>
											<HugeiconsIcon
												className="mr-1"
												icon={SentIcon}
												size={8}
											/>
											<span className="font-medium font-sans text-xs">
												Sent
											</span>
										</CommandItem>
										<CommandItem
											onSelect={() => runCommand(() => router.push("/drafts"))}
										>
											<HugeiconsIcon
												className="mr-1"
												icon={Note01Icon}
												size={8}
											/>
											<span className="font-medium font-sans text-xs">
												Drafts
											</span>
										</CommandItem>
										<CommandItem
											onSelect={() => runCommand(() => router.push("/spam"))}
										>
											<HugeiconsIcon
												className="mr-1"
												icon={Alert01Icon}
												size={8}
											/>
											<span className="font-medium font-sans text-xs">
												Spam
											</span>
										</CommandItem>
										<CommandItem
											onSelect={() => runCommand(() => router.push("/trash"))}
										>
											<HugeiconsIcon
												className="mr-1"
												icon={Delete02Icon}
												size={8}
											/>
											<span className="font-medium font-sans text-xs">
												Trash
											</span>
										</CommandItem>
										<CommandItem
											onSelect={() =>
												runCommand(() => router.push("/settings"))
											}
										>
											<HugeiconsIcon
												className="mr-1"
												icon={Settings01Icon}
												size={8}
											/>
											<span className="font-medium font-sans text-xs">
												Settings
											</span>
										</CommandItem>
									</CommandGroup>
								</CommandList>
							</>
						)}

						{mode === "advanced" && (
							<AdvancedMode onClose={() => setOpen(false)} />
						)}

						{mode === "actions" && <ActionsMode runCommand={runCommand} />}
					</div>
				</div>
			</CommandDialog>
		</>
	);
}
