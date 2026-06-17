"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button as Button2 } from "@/components/ui/button-2";
import {
	Dialog,
	DialogFooter,
	DialogHeader,
	DialogPopup,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import type { CalendarEvent } from "./types";

interface EventDialogProps {
	isOpen: boolean;
	onClose: () => void;
	event?: CalendarEvent | null;
	selectedDate?: Date | null;
}

export function EventDialog({
	isOpen,
	onClose,
	event,
	selectedDate,
}: EventDialogProps) {
	const isEdit = !!event;
	const [summary, setSummary] = useState("");
	const [location, setLocation] = useState("");
	const [description, setDescription] = useState("");
	const [isAllDay, setIsAllDay] = useState(false);

	// Basic string management for dates/times to make native inputs easy
	const [startDate, setStartDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endDate, setEndDate] = useState("");
	const [endTime, setEndTime] = useState("");

	const utils = api.useUtils();

	const createMutation = api.calendar.createEvent.useMutation({
		onSuccess: () => {
			toast.success("Event created successfully");
			utils.calendar.getEvents.invalidate();
			onClose();
		},
		onError: (err) => toast.error(`Failed to create event: ${err.message}`),
	});

	const updateMutation = api.calendar.updateEvent.useMutation({
		onSuccess: () => {
			toast.success("Event updated successfully");
			utils.calendar.getEvents.invalidate();
			onClose();
		},
		onError: (err) => toast.error(`Failed to update event: ${err.message}`),
	});

	// Initialize form on open
	useEffect(() => {
		if (isOpen) {
			if (event) {
				setSummary(event.summary ?? "");
				setLocation(event.location ?? "");
				setDescription(event.description ?? "");

				const hasTime = !!event.start?.dateTime;
				setIsAllDay(!hasTime);

				const sd = event.start?.dateTime
					? new Date(event.start.dateTime)
					: event.start?.date
						? new Date(event.start.date)
						: new Date();
				const ed = event.end?.dateTime
					? new Date(event.end.dateTime)
					: event.end?.date
						? new Date(event.end.date)
						: new Date();

				setStartDate(format(sd, "yyyy-MM-dd"));
				setEndDate(format(ed, "yyyy-MM-dd"));

				if (hasTime) {
					setStartTime(format(sd, "HH:mm"));
					setEndTime(format(ed, "HH:mm"));
				} else {
					setStartTime("09:00");
					setEndTime("10:00");
				}
			} else {
				setSummary("");
				setLocation("");
				setDescription("");
				setIsAllDay(false);

				const d = selectedDate ?? new Date();
				setStartDate(format(d, "yyyy-MM-dd"));
				setEndDate(format(d, "yyyy-MM-dd"));
				setStartTime("09:00");
				setEndTime("10:00");
			}
		}
	}, [isOpen, event, selectedDate]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!summary.trim()) {
			toast.error("Event title is required");
			return;
		}

		// Construct startAt and endAt based on isAllDay
		const startAt = isAllDay
			? `${startDate}T00:00:00.000Z`
			: `${startDate}T${startTime}:00`;
		const endAt = isAllDay
			? `${endDate}T00:00:00.000Z`
			: `${endDate}T${endTime}:00`;

		const payload = {
			summary,
			description: description.trim() || undefined,
			location: location.trim() || undefined,
			isAllDay,
			startAt,
			endAt,
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		};

		if (isEdit && event?.id) {
			updateMutation.mutate({ ...payload, eventId: event.id });
		} else {
			createMutation.mutate(payload);
		}
	};

	const isLoading = createMutation.isPending || updateMutation.isPending;

	return (
		<Dialog onOpenChange={(open) => !open && onClose()} open={isOpen}>
			<DialogPopup className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{isEdit ? "Edit Event" : "Create Event"}</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="summary">Title</Label>
							<Input
								autoFocus
								id="summary"
								onChange={(e) => setSummary(e.target.value)}
								placeholder="Add title"
								value={summary}
							/>
						</div>

						<div className="flex items-center justify-between space-x-2">
							<Label className="flex flex-col space-y-1" htmlFor="allDay">
								<span>All-day event</span>
							</Label>
							<Switch
								checked={isAllDay}
								id="allDay"
								onCheckedChange={setIsAllDay}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Start Date</Label>
								<Input
									onChange={(e) => setStartDate(e.target.value)}
									type="date"
									value={startDate}
								/>
							</div>
							{!isAllDay && (
								<div className="space-y-2">
									<Label>Start Time</Label>
									<Input
										onChange={(e) => setStartTime(e.target.value)}
										type="time"
										value={startTime}
									/>
								</div>
							)}
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>End Date</Label>
								<Input
									onChange={(e) => setEndDate(e.target.value)}
									type="date"
									value={endDate}
								/>
							</div>
							{!isAllDay && (
								<div className="space-y-2">
									<Label>End Time</Label>
									<Input
										onChange={(e) => setEndTime(e.target.value)}
										type="time"
										value={endTime}
									/>
								</div>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="location">Location</Label>
							<Input
								id="location"
								onChange={(e) => setLocation(e.target.value)}
								placeholder="Add location"
								value={location}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								className="resize-none"
								id="description"
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Add description"
								value={description}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button2
							disabled={isLoading}
							onClick={onClose}
							type="button"
							variant="outline"
						>
							Cancel
						</Button2>
						<Button2 disabled={isLoading} type="submit" variant="info">
							{isLoading ? "Saving..." : "Save"}
						</Button2>
					</DialogFooter>
				</form>
			</DialogPopup>
		</Dialog>
	);
}
