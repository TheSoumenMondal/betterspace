import { cn } from "@/lib/utils";
import type { CalendarEvent } from "./types";
import { eventColour, isToday } from "./utils";

export function DayCell({
	date,
	events,
	isCurrentMonth,
	isSelected,
	isLoading,
	onSelectDate,
}: {
	date: Date;
	events: CalendarEvent[];
	isCurrentMonth: boolean;
	isSelected: boolean;
	isLoading?: boolean;
	onSelectDate: (d: Date) => void;
}) {
	const today = isToday(date);
	const visibleDesktop = events.slice(0, 5);
	const overflowDesktop = events.length - 5;
	const visibleMobile = events.slice(0, 3);
	const overflowMobile = events.length - 3;

	return (
		// biome-ignore lint/a11y/useSemanticElements: flex grid container requires div
		<div
			className={cn(
				"relative flex min-h-0 cursor-pointer flex-col items-center justify-center border-border border-r border-b p-2 transition-colors",
				"hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:outline-none",
				isSelected && "bg-primary/4",
				today && !isSelected && "bg-blue-500/10 dark:bg-blue-500/20",
			)}
			onClick={() => onSelectDate(date)}
			onKeyDown={(e) => e.key === "Enter" && onSelectDate(date)}
			role="button"
			style={
				!isCurrentMonth
					? {
							backgroundImage:
								"repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(128, 128, 128, 0.05) 3px, rgba(128, 128, 128, 0.05) 5px)",
						}
					: undefined
			}
			tabIndex={0}
		>
			<div className="flex flex-1 items-center justify-center pb-2">
				<span
					className={cn(
						"z-10 flex h-10 w-10 items-center justify-center rounded-full font-copper-bt-regular text-2xl tracking-wide transition-colors",
						today
							? "font-medium text-blue-600 dark:text-blue-400"
							: "text-foreground",
						!isCurrentMonth && "text-muted-foreground opacity-50",
						isLoading && "animate-pulse opacity-40 blur-[2px]",
					)}
				>
					{date.getDate()}
				</span>
			</div>

			{isLoading ? (
				<div className="absolute right-0 bottom-2.5 left-0 flex flex-col items-center justify-center gap-1.5 px-2">
					<div className="h-1.5 w-6 animate-pulse rounded-full bg-muted-foreground/30 blur-[1px]" />
					<div className="h-1.5 w-4 animate-pulse rounded-full bg-muted-foreground/30 blur-[1px] delay-75" />
				</div>
			) : (
				<>
					<div
						className={cn(
							"absolute right-0 bottom-2.5 left-0 hidden flex-wrap items-center justify-center gap-1.5 px-2 sm:flex",
							!isCurrentMonth && "opacity-40",
						)}
					>
						{visibleDesktop.map((ev) => (
							<div
								className={cn(
									"h-2 w-2 rounded-full shadow-sm",
									eventColour(ev).dot,
								)}
								key={ev.id ?? ev.summary}
								title={ev.summary}
							/>
						))}
						{overflowDesktop > 0 && (
							<span className="font-bold text-[10px] text-muted-foreground leading-none">
								+{overflowDesktop}
							</span>
						)}
					</div>

					<div
						className={cn(
							"absolute right-0 bottom-2.5 left-0 flex flex-wrap items-center justify-center gap-1 px-1 sm:hidden",
							!isCurrentMonth && "opacity-40",
						)}
					>
						{visibleMobile.map((ev) => (
							<div
								className={cn(
									"h-2 w-2 rounded-full shadow-sm",
									eventColour(ev).dot,
								)}
								key={ev.id ?? ev.summary}
								title={ev.summary}
							/>
						))}
						{overflowMobile > 0 && (
							<span className="font-bold text-[10px] text-muted-foreground leading-none">
								+{overflowMobile}
							</span>
						)}
					</div>
				</>
			)}
		</div>
	);
}
