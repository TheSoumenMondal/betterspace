"use client";

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useMemo, useState } from "react";
import {
	ActionSlot,
	NavSlot,
} from "@/components/features/sidebar/navslot-context";
import { Button } from "@/components/ui/button";
import { Button as Button2 } from "@/components/ui/button-2";
import { useDemoCalendar } from "@/hooks/use-demo-calendar";
import { MONTH_NAMES, WEEKDAY_LABELS } from "../calendar/constants";
import { DayCell } from "../calendar/day-cell";
import { DayEventsSheet } from "../calendar/day-events-sheet";
import { EventDialog } from "../calendar/event-dialog";
import { StatsChip } from "../calendar/stats-chip";
import type { CalendarEvent } from "../calendar/types";
import {
	buildGrid,
	dayKey,
	endOfMonth,
	hasReminder,
	isSameDay,
	startOfMonth,
} from "../calendar/utils";

export function DemoMonthCalendarLayout() {
	const todayDate = useMemo(() => new Date(), []);
	const [year, setYear] = useState(todayDate.getFullYear());
	const [month, setMonth] = useState(todayDate.getMonth());
	const [selectedDate, setSelectedDate] = useState<Date | null>(todayDate);
	const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
	const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

	const timeMin = useMemo(
		() => startOfMonth(year, month).toISOString(),
		[year, month],
	);
	const timeMax = useMemo(
		() => endOfMonth(year, month).toISOString(),
		[year, month],
	);

	const { data, isLoading, isError } = useDemoCalendar({
		timeMin,
		timeMax,
		singleEvents: true,
		maxResults: 250,
		orderBy: "startTime",
	});

	const allEvents = useMemo(() => data?.items ?? [], [data]);

	const eventsByDay = useMemo(() => {
		const map = new Map<string, CalendarEvent[]>();
		for (const ev of allEvents) {
			const ds = ev.start?.dateTime ?? ev.start?.date;
			if (!ds) continue;
			const d = new Date(ds);
			const key = dayKey(d);
			map.set(key, [...(map.get(key) ?? []), ev]);
		}
		return map;
	}, [allEvents]);

	const grid = useMemo(() => buildGrid(year, month), [year, month]);
	const rows = grid.length / 7;

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
	const goToday = useCallback(() => {
		setYear(todayDate.getFullYear());
		setMonth(todayDate.getMonth());
		setSelectedDate(todayDate);
	}, [todayDate]);

	const withMeet = allEvents.filter((e) => e.hangoutLink).length;
	const withReminders = allEvents.filter((e) => hasReminder(e)).length;
	const allDay = allEvents.filter((e) => !e.start?.dateTime).length;

	return (
		<>
			<NavSlot>
				<div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
					<div className="hidden shrink-0 items-center sm:flex">
						<Button
							className="h-6 w-6 shrink-0"
							onClick={prevMonth}
							size="icon-sm"
							variant="ghost"
						>
							<HugeiconsIcon icon={ChevronLeftIcon} size={13} />
						</Button>
						<span className="w-23.75 shrink-0 select-none text-center font-normal text-xs sm:w-30 sm:text-sm">
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

					<Button
						className="hidden h-6 shrink-0 px-2 font-medium text-[10px] sm:text-xs lg:flex"
						onClick={goToday}
						variant="outline"
					>
						Today
					</Button>

					<div className="mx-1 hidden h-4 w-px shrink-0 bg-border lg:block" />

					<div className="hidden shrink-0 items-center gap-3 text-muted-foreground/80 sm:gap-4 lg:flex">
						<StatsChip
							isLoading={isLoading}
							label="events"
							value={allEvents.length}
						/>
						<StatsChip
							isLoading={isLoading}
							label="with Meet"
							value={withMeet}
						/>
						<StatsChip
							isLoading={isLoading}
							label="reminders"
							value={withReminders}
						/>
						<StatsChip isLoading={isLoading} label="all day" value={allDay} />
					</div>
				</div>
			</NavSlot>

			<ActionSlot>
				<Button2
					className="hidden sm:flex"
					onClick={() => setIsEventDialogOpen(true)}
					variant="info"
				>
					Create
				</Button2>
				<Button2
					className="flex sm:hidden"
					onClick={() => setIsEventDialogOpen(true)}
					size="icon"
					variant="ghost"
				>
					<HugeiconsIcon icon={PlusSignIcon} />
				</Button2>
			</ActionSlot>

			<div className="flex h-full flex-col overflow-hidden">
				<div className="grid shrink-0 grid-cols-7 border-border border-b">
					{WEEKDAY_LABELS.map((label) => (
						<div
							className="border-border border-r py-2.5 text-center font-semibold text-[10px] text-muted-foreground uppercase tracking-widest last:border-r-0"
							key={label}
						>
							{label}
						</div>
					))}
				</div>

				{isError && (
					<div className="flex flex-1 items-center justify-center p-8 text-muted-foreground text-sm">
						Failed to load calendar events — check your Google Calendar
						connection.
					</div>
				)}

				{!isError && (
					<div
						className="grid flex-1 grid-cols-7 overflow-hidden"
						style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
					>
						{grid.map((date) => {
							const evs = isLoading
								? []
								: (eventsByDay.get(dayKey(date)) ?? []);
							return (
								<DayCell
									date={date}
									events={evs}
									isCurrentMonth={date.getMonth() === month}
									isLoading={isLoading}
									isSelected={
										selectedDate ? isSameDay(date, selectedDate) : false
									}
									key={date.toISOString()}
									onSelectDate={(d) => {
										setSelectedDate(d);
										setIsDayDialogOpen(true);
									}}
								/>
							);
						})}
					</div>
				)}
			</div>

			<DayEventsSheet
				date={selectedDate ?? todayDate}
				events={
					selectedDate ? (eventsByDay.get(dayKey(selectedDate)) ?? []) : []
				}
				isOpen={isDayDialogOpen}
				onClose={() => setIsDayDialogOpen(false)}
			/>

			<EventDialog
				isOpen={isEventDialogOpen}
				onClose={() => setIsEventDialogOpen(false)}
				selectedDate={selectedDate ?? todayDate}
			/>
		</>
	);
}
