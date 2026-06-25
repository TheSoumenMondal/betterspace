import { useMemo, useState } from "react";
import { mockCalendarEvents } from "@/lib/mock-data";

// biome-ignore lint/suspicious/noExplicitAny: demo purposes
export function useDemoCalendar(queryParams: any) {
	const [events, setEvents] = useState(mockCalendarEvents);

	const filteredEvents = useMemo(() => {
		let result = events;

		if (queryParams.timeMin && queryParams.timeMax) {
			const min = new Date(queryParams.timeMin).getTime();
			const max = new Date(queryParams.timeMax).getTime();
			result = result.filter((e) => {
				const time = new Date(
					e.start?.dateTime || e.start?.date || "",
				).getTime();
				return time >= min && time <= max;
			});
		}

		if (queryParams.q) {
			const lowerQ = queryParams.q.toLowerCase();
			result = result.filter(
				(e) =>
					e.summary?.toLowerCase().includes(lowerQ) ||
					e.description?.toLowerCase().includes(lowerQ) ||
					e.location?.toLowerCase().includes(lowerQ),
			);
		}

		if (queryParams.orderBy === "startTime") {
			result = [...result].sort((a, b) => {
				const timeA = new Date(
					a.start?.dateTime || a.start?.date || "",
				).getTime();
				const timeB = new Date(
					b.start?.dateTime || b.start?.date || "",
				).getTime();
				return timeA - timeB;
			});
		}

		return result;
	}, [events, queryParams]);

	return {
		data: { items: filteredEvents },
		isLoading: false,
		isError: false,
		deleteEvent: (id: string) => {
			setEvents((prev) => prev.filter((e) => e.id !== id));
		},
	};
}
