import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getSession } from "@/server/better-auth/server";
import { db } from "@/server/db";
import { corsairAccounts } from "@/server/db/schema";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
	const session = await getSession();
	if (!session) {
		redirect("/auth/login");
	}

	const accounts = await db
		.select()
		.from(corsairAccounts)
		.where(eq(corsairAccounts.tenantId, session.user.id));

	const gmailConnected = accounts.length > 0;
	const calendarConnected = accounts.length > 0;

	return (
		<SettingsClient
			integrations={{
				gmailConnected,
				calendarConnected,
			}}
			user={{
				name: session.user.name,
				email: session.user.email,
				image: session.user.image,
				isPremium: false, // Set this based on user's actual plan/subscription later
			}}
		/>
	);
}
