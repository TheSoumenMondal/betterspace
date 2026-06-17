import { serve } from "inngest/next";
import { gmailIncomingMail } from "@/inngest/functions/incoming-mail";
import { gmailInitialSyncMail } from "@/inngest/functions/initial-sync-mail";
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
	],
});
