"use client";

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	Delete02Icon,
	PencilEdit02Icon,
	PlusSignIcon,
	SearchIcon,
	VideoIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	ActionSlot,
	NavSlot,
} from "@/components/features/sidebar/navslot-context";
import { AlarmClockIcon } from "@/components/ui/alarm-clock-icon";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Button as Button2 } from "@/components/ui/button-2";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoCalendar } from "@/hooks/use-demo-calendar";
import { cn } from "@/lib/utils";
import {
	AnimatedCalendarIcon,
	AnimatedLocationIcon,
	AnimatedUsersIcon,
	AnimatedVideoIcon,
} from "../calendar/animated-detail-icons";
import { MONTH_NAMES } from "../calendar/constants";
import { EventDialog } from "../calendar/event-dialog";
import type { CalendarEvent } from "../calendar/types";
import { endOfMonth, eventColour, startOfMonth } from "../calendar/utils";

function formatTimeRange(
	start?: { dateTime?: string; date?: string },
	end?: { dateTime?: string; date?: string },
): string {
	if (!start?.dateTime) {
		return "All day";
	}
	const s = new Date(start.dateTime);
	const e = end?.dateTime ? new Date(end.dateTime) : null;
	const fmt = (d: Date) =>
		d.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	return e ? `${fmt(s)} – ${fmt(e)}` : fmt(s);
}

function EventCardSkeleton() {
	return (
		<div className="animate-pulse space-y-2.5 rounded-xl border border-border bg-card p-4">
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-3 w-1/2" />
		</div>
	);
}

interface EventCardProps {
	event: CalendarEvent;
	isSelected: boolean;
	onSelect: (event: CalendarEvent) => void;
}

function EventCard({ event, isSelected, onSelect }: EventCardProps) {
	const colorObj = eventColour(event) ?? { pill: "", dot: "", lightBg: "" };
	const bgClass = colorObj.lightBg;
	const timeStr = formatTimeRange(event.start, event.end);
	const isAllDay = !event.start?.dateTime;

	return (
		<button
			className={cn(
				"flex w-full cursor-pointer gap-3 rounded-xl border border-dashed px-3 py-3 text-left transition-all hover:opacity-80",
				bgClass,
				isSelected && "opacity-100",
			)}
			onClick={() => onSelect(event)}
			type="button"
		>
			<div className={cn("h-full w-1 rounded-full", colorObj.dot)} />
			<div className="min-w-0 flex-1">
				<p className="truncate font-semibold text-foreground text-sm leading-tight">
					{event.summary ?? "(No title)"}
				</p>
				<p className="mt-0.5 text-muted-foreground text-xs">{timeStr}</p>
				{event.location && (
					<p className="mt-0.5 truncate text-muted-foreground text-xs">
						{event.location}
					</p>
				)}
				{(event.hangoutLink || isAllDay) && (
					<div className="mt-1.5 flex items-center gap-2">
						{event.hangoutLink && (
							<Badge
								className="h-4.5 gap-1 border-none bg-blue-500/10 px-2 py-0 font-medium text-[10px] text-blue-600 dark:text-blue-400"
								variant="secondary"
							>
								<HugeiconsIcon icon={VideoIcon} size={10} />
								Meet
							</Badge>
						)}
						{isAllDay && (
							<Badge
								className="h-4.5 border-border px-2 py-0 font-medium text-[10px]"
								variant="outline"
							>
								All day
							</Badge>
						)}
					</div>
				)}
			</div>
		</button>
	);
}

interface EventDetailPanelProps {
	event: CalendarEvent | null;
	onEdit?: (event: CalendarEvent) => void;
	onDelete?: (event: CalendarEvent) => void;
}

function EventDetailPanel({ event, onEdit, onDelete }: EventDetailPanelProps) {
	if (!event) {
		return (
			<div className="flex h-full select-none flex-col items-center justify-center gap-4 p-8 text-muted-foreground">
				<Image
					alt="Waving Panda"
					className="h-40 w-40 select-none object-contain opacity-80 drop-shadow-sm"
					height={160}
					priority
					src="/waving_hand.png"
					unoptimized
					width={160}
				/>
				<h3 className="mt-4 font-copper-bt-regular text-[17px] text-foreground tracking-wide">
					Hey there!
				</h3>
				<p className="mt-1.5 max-w-60 text-center font-medium text-[13.5px] text-muted-foreground/80 leading-snug tracking-tight">
					Select an event from the timeline to see its full details and
					attendees.
				</p>
			</div>
		);
	}

	const colorObj = eventColour(event);
	const dotClass = colorObj.dot;

	const isCreator = event.creator?.self;
	const isOrganizer = event.organizer?.self;
	const isImported =
		(event.organizer?.email?.includes("import.calendar.google.com") ?? false) ||
		(event.description?.includes("Added automatically") ?? false);
	const canEdit = (isCreator || isOrganizer) && !isImported;

	return (
		<div className="flex min-h-0 flex-1 flex-col bg-card">
			<div className="relative rounded-t-lg border-border border-b bg-muted/10 px-6 py-5">
				<div className="flex items-start gap-3">
					<span
						className={cn(
							"mt-1.5 size-3 shrink-0 rounded-full shadow-sm",
							dotClass,
						)}
					/>
					<div className="min-w-0 flex-1 pr-12">
						<h2 className="font-copper-bt-regular text-[17px] text-foreground leading-snug tracking-wide">
							{event.summary ?? "(No title)"}
						</h2>
						<p className="mt-1.5 font-medium text-[13px] text-muted-foreground">
							{formatTimeRange(event.start, event.end)}
						</p>
					</div>
				</div>

				{(onEdit || onDelete) && (
					<div className="absolute top-4 right-4 flex items-center gap-1">
						{onEdit && (
							<Button
								onClick={() => {
									if (!canEdit) {
										toast.error(
											"You cannot edit this event because it was created by someone else.",
										);
										return;
									}
									onEdit(event);
								}}
								size="icon-sm"
								variant="ghost"
							>
								<HugeiconsIcon icon={PencilEdit02Icon} size={14} />
							</Button>
						)}
						{onDelete && (
							<Button
								className="text-destructive hover:bg-destructive/10 hover:text-destructive"
								onClick={() => {
									if (!canEdit) {
										toast.error(
											"You cannot delete this event because it was created by someone else.",
										);
										return;
									}
									onDelete(event);
								}}
								size="icon-sm"
								variant="ghost"
							>
								<HugeiconsIcon icon={Delete02Icon} size={14} />
							</Button>
						)}
					</div>
				)}
			</div>

			<ScrollArea className="custom-scrollbar min-h-0 flex-1">
				<div className="space-y-5 px-5 py-5">
					<div className="flex items-start gap-3.5 text-sm">
						<AlarmClockIcon
							className="shrink-0 cursor-default rounded-lg bg-muted/50 p-2 text-muted-foreground"
							size={16}
						/>
						<div>
							<p className="font-semibold text-foreground">
								{event.start?.dateTime
									? new Date(event.start.dateTime).toLocaleDateString("en-US", {
											weekday: "long",
											year: "numeric",
											month: "long",
											day: "numeric",
										})
									: (event.start?.date ?? "—")}
							</p>
							<p className="mt-0.5 text-[13px] text-muted-foreground">
								{formatTimeRange(event.start, event.end)}
							</p>
						</div>
					</div>

					{event.location && (
						<div className="flex items-start gap-3.5 text-sm">
							<AnimatedLocationIcon size={16} />
							<p className="mt-1 text-[13px] text-foreground leading-snug">
								{event.location}
							</p>
						</div>
					)}

					{event.hangoutLink && (
						<div className="flex items-start gap-3.5 text-sm">
							<AnimatedVideoIcon size={16} />
							<a
								className="mt-1 font-medium text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
								href={event.hangoutLink}
								rel="noreferrer"
								target="_blank"
							>
								Join Google Meet
							</a>
						</div>
					)}

					{/* Attendees */}
					{event.attendees && event.attendees.length > 0 && (
						<div className="flex items-start gap-3.5 text-sm">
							<AnimatedUsersIcon size={16} />
							<div className="mt-1 space-y-1.5">
								{event.attendees
									.slice(0, 6)
									.map(
										(
											a: NonNullable<CalendarEvent["attendees"]>[number],
											i: number,
										) => (
											<p
												className="flex items-center gap-2 text-[13px] text-foreground"
												// biome-ignore lint/suspicious/noArrayIndexKey: index is fine for static attendee list
												key={i}
											>
												<span
													className={cn(
														"size-1.5 shrink-0 rounded-full",
														a.responseStatus === "accepted"
															? "bg-emerald-500"
															: a.responseStatus === "declined"
																? "bg-rose-500"
																: "bg-muted-foreground",
													)}
												/>
												<span className="font-medium">
													{a.displayName ?? a.email ?? "Unknown"}
												</span>
												{a.self && (
													<span className="text-muted-foreground opacity-70">
														(you)
													</span>
												)}
											</p>
										),
									)}
								{event.attendees.length > 6 && (
									<p className="pt-1 font-medium text-[13px] text-muted-foreground">
										+{event.attendees.length - 6} more
									</p>
								)}
							</div>
						</div>
					)}

					{event.description && (
						<div className="space-y-2 pt-1">
							<p className="px-0.5 font-semibold text-[11px] text-muted-foreground/60 uppercase tracking-widest">
								Notes
							</p>
							<div
								className="wrap-break-word whitespace-pre-wrap rounded-xl border border-border/30 bg-muted/30 px-4 py-3.5 text-[13px] text-foreground/80 leading-relaxed [&_a]:break-all [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-opacity hover:[&_a]:opacity-80"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: safe — own Google Calendar data
								dangerouslySetInnerHTML={{
									__html: event.description
										.replace(/<a /gi, '<a target="_blank" rel="noreferrer" ')
										.replace(/<br\s*\/?>\s*\n/gi, "<br/>"),
								}}
							/>
						</div>
					)}

					{(event.organizer || event.creator) && (
						<div className="flex items-start gap-3.5 pt-2 text-sm">
							<AnimatedCalendarIcon size={16} />
							<div className="mt-0.5 min-w-0 flex-1">
								<p className="truncate font-medium text-[13px] text-foreground">
									{event.organizer?.displayName ||
										event.creator?.displayName ||
										event.organizer?.email ||
										"Calendar"}
								</p>
								{(event.organizer?.email || event.creator?.email) && (
									<p className="mt-0.5 break-all text-[12px] text-muted-foreground opacity-80">
										Created by: {event.organizer?.email || event.creator?.email}
									</p>
								)}
							</div>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}

interface ListViewProps {
	events: CalendarEvent[];
	isLoading: boolean;
	isError: boolean;
	selectedEvent: CalendarEvent | null;
	onSelectEvent: (event: CalendarEvent) => void;
}

function ListView({
	events,
	isLoading,
	isError,
	selectedEvent,
	onSelectEvent,
}: ListViewProps) {
	if (isError) {
		return (
			<div className="flex flex-1 items-center justify-center p-8 text-muted-foreground text-sm">
				Failed to load events. Check your Google Calendar connection.
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4 p-6 lg:p-8">
				<EventCardSkeleton />
				<EventCardSkeleton />
				<EventCardSkeleton />
				<EventCardSkeleton />
			</div>
		);
	}

	if (events.length === 0) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center p-8 text-muted-foreground">
				<p className="font-medium text-[15px] tracking-tight">
					No events found for this month.
				</p>
			</div>
		);
	}

	const grouped: Record<string, CalendarEvent[]> = {};
	for (const ev of events) {
		const dStr = ev.start?.dateTime ?? ev.start?.date;
		if (!dStr) continue;
		const d = new Date(dStr);
		const key = d.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
		});
		if (!grouped[key]) grouped[key] = [];
		grouped[key].push(ev);
	}

	return (
		<div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
			<div className="w-full max-w-4xl space-y-8 px-4 py-6 lg:py-8">
				{Object.entries(grouped).map(([dateLabel, dayEvents]) => (
					<div className="space-y-4" key={dateLabel}>
						<h3 className="ml-1 font-copper-bt-regular text-[14px] text-muted-foreground uppercase tracking-widest">
							{dateLabel}
						</h3>
						<div className="flex flex-col gap-2">
							{dayEvents.map((ev) => (
								<EventCard
									event={ev}
									isSelected={selectedEvent?.id === ev.id}
									key={ev.id ?? ev.summary}
									onSelect={onSelectEvent}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function DemoCalendarLayout() {
	const todayDate = useMemo(() => new Date(), []);
	const [year, setYear] = useState(todayDate.getFullYear());
	const [month, setMonth] = useState(todayDate.getMonth());

	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null,
	);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogEvent, setDialogEvent] = useState<CalendarEvent | null>(null);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(
		null,
	);

	const handleEditEvent = useCallback((event: CalendarEvent) => {
		setSheetOpen(false);
		// Use a small timeout to let the sheet start closing before the dialog captures focus
		setTimeout(() => {
			setDialogEvent(event);
			setDialogOpen(true);
		}, 100);
	}, []);

	const handleCreateEvent = useCallback(() => {
		setDialogEvent(null);
		setDialogOpen(true);
	}, []);

	// Deleted mutation handled below in confirmDelete

	const handleDeleteEvent = useCallback((event: CalendarEvent) => {
		setSheetOpen(false);
		setTimeout(() => {
			setEventToDelete(event);
			setDeleteDialogOpen(true);
		}, 100);
	}, []);

	const handleSelectEvent = useCallback((event: CalendarEvent) => {
		setSelectedEvent(event);

		if (typeof window !== "undefined" && window.innerWidth < 1024) {
			setSheetOpen(true);
		}
	}, []);

	const timeMin = useMemo(
		() => startOfMonth(year, month).toISOString(),
		[year, month],
	);
	const timeMax = useMemo(
		() => endOfMonth(year, month).toISOString(),
		[year, month],
	);

	const { data, isLoading, isError, deleteEvent } = useDemoCalendar({
		timeMin,
		timeMax,
		singleEvents: true,
		maxResults: 250,
		orderBy: "startTime",
		q: searchQuery || undefined,
	});

	const confirmDelete = useCallback(() => {
		if (eventToDelete?.id) {
			deleteEvent(eventToDelete.id);
			setSelectedEvent(null);
			setSheetOpen(false);
			setDeleteDialogOpen(false);
			setEventToDelete(null);
		}
	}, [eventToDelete, deleteEvent]);

	const allEvents = useMemo(
		() => (data?.items as CalendarEvent[]) ?? [],
		[data],
	);

	const prevMonth = useCallback(() => {
		setMonth((m) => {
			if (m === 0) {
				setYear((y) => y - 1);
				return 11;
			}
			return m - 1;
		});
	}, []);
	const nextMonth = useCallback(() => {
		setMonth((m) => {
			if (m === 11) {
				setYear((y) => y + 1);
				return 0;
			}
			return m + 1;
		});
	}, []);

	return (
		<>
			<NavSlot>
				<div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
					<div className="hidden shrink-0 items-center sm:flex">
						<Button
							className="h-6 w-6 shrink-0"
							onClick={prevMonth}
							size="icon-sm"
							variant="ghost"
						>
							<HugeiconsIcon icon={ChevronLeftIcon} size={13} />
						</Button>
						<span className="w-25 shrink-0 select-none text-center font-medium text-[13px] sm:w-30">
							{MONTH_NAMES[month]} {year}
						</span>
						<Button
							className="h-6 w-6 shrink-0"
							onClick={nextMonth}
							size="icon-sm"
							variant="ghost"
						>
							<HugeiconsIcon icon={ChevronRightIcon} size={13} />
						</Button>
					</div>

					<div className="ml-auto hidden w-full max-w-xs sm:block">
						<InputGroup className="h-7 w-full">
							<InputGroupAddon>
								<HugeiconsIcon
									className="text-muted-foreground"
									icon={SearchIcon}
									size={12}
								/>
							</InputGroupAddon>
							<InputGroupInput
								className="h-7 text-[12px]"
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search events…"
								value={searchQuery}
							/>
						</InputGroup>
					</div>
				</div>
			</NavSlot>

			<ActionSlot>
				<Button2
					className="hidden sm:flex"
					onClick={handleCreateEvent}
					variant="info"
				>
					Create
				</Button2>
				<Button2
					className="flex sm:hidden"
					onClick={handleCreateEvent}
					size="icon"
					variant="ghost"
				>
					<HugeiconsIcon icon={PlusSignIcon} />
				</Button2>
			</ActionSlot>

			<div className="flex min-h-0 flex-1 overflow-hidden">
				<div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
					<ListView
						events={allEvents}
						isError={isError}
						isLoading={isLoading}
						onSelectEvent={handleSelectEvent}
						selectedEvent={selectedEvent}
					/>
				</div>

				<div className="hidden w-85 shrink-0 flex-col overflow-hidden border-border border-l bg-card lg:flex xl:w-100">
					<EventDetailPanel
						event={selectedEvent}
						onDelete={handleDeleteEvent}
						onEdit={handleEditEvent}
					/>
				</div>
			</div>

			<Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
				<SheetContent
					className="flex h-[85dvh] flex-col overflow-hidden rounded-t-2xl p-0 lg:hidden"
					showCloseButton={false}
					side="bottom"
				>
					<div className="flex shrink-0 justify-center pt-3 pb-1">
						<div className="h-1 w-10 rounded-full bg-muted-foreground/20" />
					</div>
					<SheetTitle className="sr-only">
						{selectedEvent?.summary ?? "Event details"}
					</SheetTitle>
					<div className="min-h-0 flex-1 overflow-hidden">
						<EventDetailPanel
							event={selectedEvent}
							onDelete={handleDeleteEvent}
							onEdit={handleEditEvent}
						/>
					</div>
				</SheetContent>
			</Sheet>

			<EventDialog
				event={dialogEvent}
				isOpen={dialogOpen}
				onClose={() => setDialogOpen(false)}
			/>

			<AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Event</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this event? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button2
							onClick={() => setDeleteDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button2>
						<Button2 onClick={confirmDelete} variant="destructive">
							Delete
						</Button2>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
