import { addDays, subDays } from "date-fns";
import type { CalendarEvent } from "@/components/features/calendar/types";

// Deterministic PRNG for hydration consistency
let seed = 12345;
function random() {
	const x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}

// Fixed baseline date for hydration consistency
const BASE_DATE = new Date("2026-06-25T12:00:00Z");

export interface MockEmail {
	id: string;
	threadId: string;
	labelIds: string[];
	snippet: string;
	payload: {
		headers: { name: string; value: string }[];
	};
	aiMetadata: {
		importance?: string;
		priorityScore?: number;
		hasMeetingSignal?: boolean;
		hasDeadline?: boolean;
		hasInvoice?: boolean;
		hasAttachment?: boolean;
	};
}

const FIRST_NAMES = [
	"Alex",
	"Jordan",
	"Taylor",
	"Casey",
	"Morgan",
	"Riley",
	"Sam",
	"Jamie",
	"Drew",
	"Quinn",
];
const LAST_NAMES = [
	"Smith",
	"Johnson",
	"Williams",
	"Brown",
	"Jones",
	"Garcia",
	"Miller",
	"Davis",
	"Rodriguez",
	"Martinez",
];
const DOMAINS = [
	"example.com",
	"company.org",
	"startup.io",
	"tech.net",
	"business.co",
];

const SUBJECTS = [
	"Project Update: Q3 Deliverables",
	"Invoice for Services Rendered",
	"Meeting Request: Next Steps",
	"Weekly Status Report",
	"Important: Security Update",
	"Following up on our conversation",
	"Action Required: Account Verification",
	"Your receipt from Stripe",
	"Invitation: Product Launch Event",
	"Design Assets for Campaign",
	"Feedback on the latest draft",
	"Contract Renewal Attached",
	"Quick Question about the timeline",
	"Welcome to the team!",
	"Out of Office: Vacation",
];

const SNIPPETS = [
	"Hi team,\n\nJust wanted to share a comprehensive update on the Q3 deliverables. Everything is currently on track for next week.\n\nWe have completed the backend infrastructure migration and the frontend team is currently wrapping up the new user dashboard. QA will begin their end-to-end testing cycle on Monday morning.\n\nPlease review the attached detailed timeline and let me know if there are any immediate concerns we need to address before the stakeholder meeting.\n\nBest regards,\nThe Engineering Team",
	"Hello,\n\nPlease find the attached invoice for the services rendered last month. As per our previous agreement, this covers the consulting hours as well as the new software licenses.\n\nWe would appreciate it if you could process this payment within the standard 30-day window to ensure uninterrupted access to the platform.\n\nIf you have any questions or require a breakdown of the specific line items, don't hesitate to reach out.\n\nThank you for your business,\nFinance Department",
	"Hi there,\n\nAre you available for a quick sync tomorrow at 2 PM to discuss the next steps on the integration project?\n\nI feel like we're close to a breakthrough, but there are a few edge cases in the API documentation that we need to clarify with your lead developer. If tomorrow doesn't work, please suggest a few alternative times later in the week.\n\nLooking forward to wrapping this up!\n\nBest,\nProduct Team",
	"Team,\n\nHere is the weekly status report. We've made great progress on the backend integration over the last few days.\n\n- The legacy database has been fully deprecated.\n- All active users have been migrated to the new schema without any data loss.\n- Latency on the primary endpoints has dropped by 40%.\n\nI want to give a huge shoutout to everyone who worked over the weekend to make this happen. Let's keep this momentum going!\n\nCheers,\nManagement",
	"URGENT: Security Update Required\n\nPlease be aware of an upcoming critical security update that requires your immediate attention. We have identified a vulnerability in the older version of our VPN client that could potentially expose internal network traffic.\n\nYou are required to download and install version 4.2.1 from the IT portal before Friday at 5:00 PM. Failure to do so will result in an automatic suspension of remote access privileges.\n\nContact the IT Helpdesk if you encounter any installation issues.\n\nRegards,\nIT Security Admin",
	"Hi,\n\nI wanted to follow up on our conversation from yesterday. Have you had a chance to review the strategy document I sent over?\n\nWe need to lock in the budget allocations by early next week, and your department's estimates are the last piece of the puzzle. Let me know if you need any clarification on the new formatting guidelines.\n\nLet's aim to have a final draft ready by Thursday.\n\nThanks,\nStrategy & Ops",
	"Dear User,\n\nYour account requires verification to comply with our updated security policies. Please click the secure link below to verify your email address and update your two-factor authentication settings.\n\nIf you do not complete this process within 48 hours, your account may be temporarily restricted to read-only mode to prevent unauthorized access.\n\nThank you for helping us keep our platform safe.\n\nSupport Team",
	"Thank you for your purchase!\n\nYour receipt from Stripe is attached below for your records. Your new subscription plan is now active and you should have immediate access to all premium features.\n\nWe've also included a quick-start guide to help you get the most out of your new tools. If you run into any issues during setup, our success team is available 24/7 via the live chat widget in your dashboard.\n\nWelcome aboard!\n\nThe Customer Success Team",
	"You are officially invited!\n\nPlease join us for our exclusive product launch event next Friday at the downtown convention center. We will be unveiling our highly anticipated new hardware lineup.\n\nThe evening will include a keynote presentation, a hands-on demo session, and a catered networking reception. Space is strictly limited, so please RSVP by Wednesday to secure your spot.\n\nWe can't wait to share what we've been working on!\n\nBest,\nEvents Team",
	"Hi,\n\nI've attached the final design assets for the new marketing campaign. This includes the updated logo variants, the social media banner templates, and the print-ready brochures.\n\nPlease note that the color palette has been slightly tweaked to improve contrast and accessibility. Take a look and let me know what you think.\n\nIf everything looks good, I'll go ahead and upload these to the shared drive for the marketing team to start using immediately.\n\nCheers,\nDesign Team",
	"Hey,\n\nThanks for sending over the latest draft of the blog post. I left a few comments and suggestions directly in the Google Doc.\n\nOverall, the structure is great, but I think we need a stronger call-to-action at the end to drive newsletter signups. I also flagged a couple of statistics that we should probably double-check against our internal analytics dashboard before publishing.\n\nLet me know when you've made the revisions and I'll give it a final review.\n\nBest,\nEditorial",
	"Hello,\n\nThe contract renewal for the upcoming fiscal year is attached. The terms remain largely the same, with the exception of the updated SLA clauses we discussed last month.\n\nPlease review the document, sign it, and return it to us by the end of the week. If your legal team requires any further amendments, please redline the document and send it back as soon as possible so we don't delay the rollout.\n\nLooking forward to another great year of partnership.\n\nLegal Department",
	"Hi team,\n\nQuick question: are we still on track to launch the new user onboarding flow on the 15th?\n\nI was looking at the Jira board and it seems like a few critical bugs are still lingering in the 'In Progress' column. I want to make sure marketing knows if they need to push back their email announcements.\n\nPlease give me a realistic assessment of where we stand by EOD today.\n\nThanks,\nProduct Manager",
	"Welcome aboard!\n\nWe are absolutely thrilled to welcome you to the team! Your official start date is next Monday at 9:00 AM. Your onboarding schedule, along with instructions for accessing the building and picking up your laptop, is attached.\n\nYour manager will be waiting to greet you in the main lobby. We've arranged a team lunch for your first day so everyone can get to know you.\n\nIf you have any questions between now and then, just reply to this email.\n\nWelcome to the company!\nHR Department",
	"Hello,\n\nPlease note that I will be out of the office on annual leave starting tomorrow until next Monday, with very limited access to email or Slack.\n\nIf you have an urgent issue regarding the database migration, please contact Sarah. For all other general inquiries, please reach out to the shared team inbox and someone will assist you.\n\nI will review all pending pull requests as soon as I return.\n\nBest regards,\nSenior Developer",
];

function getRandomItem<T>(arr: T[]): T {
	return arr[Math.floor(random() * arr.length)] as T;
}

function generateEmail(id: number, labelId: string): MockEmail {
	const firstName = getRandomItem(FIRST_NAMES);
	const lastName = getRandomItem(LAST_NAMES);
	const domain = getRandomItem(DOMAINS);
	const fromName = `${firstName} ${lastName}`;
	const fromEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;

	const subject = getRandomItem(SUBJECTS);
	const snippet = getRandomItem(SNIPPETS);

	// Random date within the last 30 days
	const date = subDays(BASE_DATE, Math.floor(random() * 30));

	// Determine metadata based on subject/snippet
	const hasInvoice =
		subject.toLowerCase().includes("invoice") ||
		subject.toLowerCase().includes("receipt");
	const hasMeetingSignal =
		subject.toLowerCase().includes("meeting") ||
		snippet.toLowerCase().includes("sync");
	const hasDeadline =
		subject.toLowerCase().includes("action required") ||
		snippet.toLowerCase().includes("by the end of");
	const hasAttachment =
		subject.toLowerCase().includes("attached") ||
		snippet.toLowerCase().includes("attached");

	const importance =
		hasInvoice || hasDeadline ? "high" : hasMeetingSignal ? "medium" : "low";
	const priorityScore =
		hasInvoice || hasDeadline ? 90 : hasMeetingSignal ? 60 : 30;

	const labels = [labelId];
	if (random() > 0.7 && labelId === "INBOX") {
		labels.push("UNREAD");
	}
	if (random() > 0.8) {
		labels.push("STARRED");
	}

	return {
		id: `mock_email_${labelId}_${id}`,
		threadId: `mock_thread_${labelId}_${id}`,
		labelIds: labels,
		snippet: snippet,
		payload: {
			headers: [
				{ name: "From", value: `"${fromName}" <${fromEmail}>` },
				{ name: "To", value: `"Demo User" <demo@betterspace.tech>` },
				{ name: "Subject", value: subject },
				{ name: "Date", value: date.toUTCString() },
			],
		},
		aiMetadata: {
			importance,
			priorityScore,
			hasMeetingSignal,
			hasDeadline,
			hasInvoice,
			hasAttachment,
		},
	};
}

function generateEmailsForLabel(labelId: string, count: number): MockEmail[] {
	return Array.from({ length: count }).map((_, i) => generateEmail(i, labelId));
}

export const mockEmails: MockEmail[] = [
	...generateEmailsForLabel("INBOX", 50),
	...generateEmailsForLabel("SENT", 50),
	...generateEmailsForLabel("DRAFT", 50),
	...generateEmailsForLabel("SPAM", 50),
	...generateEmailsForLabel("TRASH", 50),
].sort((a, b) => {
	const dateA = new Date(
		a.payload.headers.find((h) => h.name === "Date")?.value ?? "",
	).getTime();
	const dateB = new Date(
		b.payload.headers.find((h) => h.name === "Date")?.value ?? "",
	).getTime();
	return dateB - dateA;
});

export const mockCalendarEvents: CalendarEvent[] = Array.from({
	length: 20,
}).map((_, i) => {
	const isFuture = random() > 0.5;
	const daysOffset = Math.floor(random() * 14);
	const eventDate = isFuture
		? addDays(BASE_DATE, daysOffset)
		: subDays(BASE_DATE, daysOffset);

	return {
		id: `mock_event_${i}`,
		summary: getRandomItem([
			"Sync with Design",
			"Weekly Team Meeting",
			"Client Call",
			"Product Review",
			"1:1 with Manager",
		]),
		description: "Please join the meeting via Zoom link.",
		start: { dateTime: eventDate.toISOString() },
		end: { dateTime: addDays(eventDate, 1 / 24).toISOString() }, // 1 hour later
		attendees: [
			{ email: "demo@betterspace.tech", responseStatus: "accepted" as const },
			{ email: "colleague@example.com", responseStatus: "accepted" as const },
		],
	};
});
