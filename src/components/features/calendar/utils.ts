import { FALLBACK, GCAL_COLOURS } from "./constants";
import type { CalendarEvent } from "./types";

export function eventColour(ev: CalendarEvent) {
	if (ev.colorId) {
		const color = GCAL_COLOURS[ev.colorId];
		if (color) return color;
	}
	const key = ev.id ?? ev.summary ?? "";
	let h = 0;
	for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
	return FALLBACK[h % FALLBACK.length] ?? { pill: "", dot: "", lightBg: "" };
}

export function startOfMonth(y: number, m: number) {
	return new Date(y, m, 1);
}
export function endOfMonth(y: number, m: number) {
	return new Date(y, m + 1, 0, 23, 59, 59, 999);
}
export function isToday(d: Date) {
	const n = new Date();
	return (
		d.getFullYear() === n.getFullYear() &&
		d.getMonth() === n.getMonth() &&
		d.getDate() === n.getDate()
	);
}
export function isSameDay(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}
export function dayKey(d: Date) {
	return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function fmtTime(s: string) {
	return new Date(s).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}
export function fmtRange(
	start?: CalendarEvent["start"],
	end?: CalendarEvent["end"],
) {
	if (!start?.dateTime) return "All day";
	return end?.dateTime
		? `${fmtTime(start.dateTime)} – ${fmtTime(end.dateTime)}`
		: fmtTime(start.dateTime);
}

export function hasReminder(ev: CalendarEvent) {
	return (
		ev.reminders?.useDefault === true ||
		(ev.reminders?.overrides?.length ?? 0) > 0
	);
}

export function buildGrid(y: number, m: number): Date[] {
	const first = startOfMonth(y, m);
	const last = endOfMonth(y, m);
	const cells: Date[] = [];
	for (let i = 0; i < first.getDay(); i++) {
		const d = new Date(first);
		d.setDate(d.getDate() - (first.getDay() - i));
		cells.push(d);
	}
	for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(y, m, d));
	const total = Math.ceil(cells.length / 7) * 7;
	let next = 1;
	while (cells.length < total) cells.push(new Date(y, m + 1, next++));
	return cells;
}
