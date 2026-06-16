import {
	BellIcon,
	Clock01Icon,
	Location01Icon,
	VideoIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "./types";
import { eventColour, fmtRange, hasReminder } from "./utils";

export function DayEventsSheet({
	date,
	events,
	isOpen,
	onClose,
}: {
	date: Date;
	events: CalendarEvent[];
	isOpen: boolean;
	onClose: () => void;
}) {
	return (
		<Sheet onOpenChange={(open) => !open && onClose()} open={isOpen}>
			<SheetContent
				className="flex w-100 flex-col border-border border-l bg-card p-0 sm:max-w-md"
				side="right"
			>
				<SheetHeader className="shrink-0 border-border/50 border-b bg-muted/10 p-5">
					<SheetTitle className="font-copper-bt-regular font-normal text-2xl tracking-wide">
						{date.toLocaleDateString("en-US", {
							weekday: "long",
							month: "long",
							day: "numeric",
						})}
					</SheetTitle>
					<SheetDescription className="mt-0.5 font-medium text-muted-foreground text-sm">
						{events.length} event{events.length !== 1 ? "s" : ""}
					</SheetDescription>
				</SheetHeader>

				<div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto bg-muted/5 p-5">
					{events.length === 0 ? (
						<div className="flex h-full flex-col items-center justify-center px-4 py-16 text-center text-muted-foreground">
							<Image
								alt="Sleeping panda"
								className="mb-6 h-35 w-35 select-none object-contain opacity-80 drop-shadow-sm"
								height={140}
								priority
								src="/panda_sleep.png"
								unoptimized
								width={140}
							/>
							<p className="mb-2 font-copper-bt-regular text-[22px] text-foreground/80 tracking-wide">
								It's a quiet day
							</p>
							<p className="mx-auto max-w-65 text-[14.5px] leading-relaxed opacity-70">
								You have absolutely zero events scheduled for today. Kick back,
								relax, and enjoy your well-deserved free time!
							</p>
						</div>
					) : (
						events.map((ev) => {
							const c = eventColour(ev);
							return (
								<div
									className="relative flex flex-col overflow-hidden p-4"
									key={ev.id ?? ev.summary}
								>
									<div
										className={cn(
											"absolute top-3 bottom-3 left-0 w-1 rounded-r-full opacity-80",
											c.dot,
										)}
									/>

									<div className="min-w-0 flex-1 pl-2">
										{/* Header */}
										<p className="font-copper-bt-regular font-normal text-[17px] text-foreground leading-snug tracking-wide">
											{ev.summary ?? "(No title)"}
										</p>

										<div className="mt-2 space-y-1.5">
											{/* Time */}
											<div className="flex items-center gap-2 font-medium text-[13px] text-muted-foreground">
												<HugeiconsIcon
													className="opacity-70"
													icon={Clock01Icon}
													size={14}
												/>
												<span>{fmtRange(ev.start, ev.end)}</span>
											</div>

											{hasReminder(ev) && (
												<div className="flex items-center gap-2 font-medium text-[13px] text-muted-foreground">
													<HugeiconsIcon
														className="opacity-70"
														icon={BellIcon}
														size={14}
													/>
													<span>Reminder</span>
												</div>
											)}

											{ev.hangoutLink && (
												<div className="flex items-center gap-2 font-medium text-[13px] text-blue-600 dark:text-blue-400">
													<HugeiconsIcon
														className="opacity-70"
														icon={VideoIcon}
														size={14}
													/>
													<a
														className="hover:underline"
														href={ev.hangoutLink}
														rel="noreferrer"
														target="_blank"
													>
														Join Google Meet
													</a>
												</div>
											)}

											{!ev.start?.dateTime && (
												<div className="flex items-center gap-2 font-medium text-[13px] text-muted-foreground">
													<div className="flex w-3.5 justify-center">
														<div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
													</div>
													<span>All day</span>
												</div>
											)}

											{(ev.recurrence?.length ?? 0) > 0 && (
												<div className="flex items-center gap-2 font-medium text-[13px] text-muted-foreground">
													<div className="flex w-3.5 justify-center">
														<div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
													</div>
													<span>Recurring</span>
												</div>
											)}

											{ev.location && (
												<div className="flex items-start gap-2 font-medium text-[13px] text-muted-foreground">
													<HugeiconsIcon
														className="mt-0.5 shrink-0 opacity-70"
														icon={Location01Icon}
														size={14}
													/>
													<span className="leading-snug">{ev.location}</span>
												</div>
											)}
										</div>

										{ev.attendees && ev.attendees.length > 0 && (
											<div className="flex flex-wrap gap-1.5 pt-2.5">
												{ev.attendees.map(
													(
														a: NonNullable<CalendarEvent["attendees"]>[number],
														i: number,
													) => (
														<span
															className={cn(
																"rounded-md px-2 py-0.5 font-medium text-[10px]",
																a.responseStatus === "accepted"
																	? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
																	: a.responseStatus === "declined"
																		? "bg-rose-500/10 dark:text-rose-400"
																		: "border-border/50 bg-muted",
															)}
															// biome-ignore lint/suspicious/noArrayIndexKey: index is fine for static list
															key={i}
														>
															{a.displayName ??
																a.email?.split("@")[0] ??
																"Guest"}
														</span>
													),
												)}
											</div>
										)}
									</div>
								</div>
							);
						})
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
