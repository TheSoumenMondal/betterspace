import { serve } from "inngest/next";
import { calendarIncomingEvent } from "@/inngest/functions/incoming-calendar";
import { gmailIncomingMail } from "@/inngest/functions/incoming-mail";
import { gmailInitialSyncMail } from "@/inngest/functions/initial-sync-mail";
import { renewCalendarWatches } from "@/inngest/functions/renew-calendar-watches";
import { renewGmailWatches } from "@/inngest/functions/renew-gmail-watches";
import { inngest } from "../../../inngest/client";
import { calendarInitialSync } from "../../../inngest/functions/initial-sync-calendar";

export const maxDuration = 300;

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [
		gmailInitialSyncMail,
		gmailIncomingMail,
		calendarInitialSync,
		renewGmailWatches,
		renewCalendarWatches,
		calendarIncomingEvent,
	],
});
