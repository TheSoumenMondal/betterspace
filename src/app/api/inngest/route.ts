import { serve } from "inngest/next";
import { gmailInitialSyncMail } from "@/inngest/functions/initial-sync-mail";
import { inngest } from "../../../inngest/client";

export const maxDuration = 300;

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [gmailInitialSyncMail],
});
