import { processOAuthCallback } from "corsair/oauth";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { corsair } from "@/corsair";
import { inngest } from "@/inngest/client";
import { auth } from "@/server/better-auth";
import { db } from "@/server/db";
import { corsairAccounts, corsairIntegrations } from "@/server/db/schema";

const REDIRECT_URI = `${process.env.APP_URL}/api/auth/google/callback`;

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");
	const state = searchParams.get("state");

	if (!code || !state) {
		const response = new NextResponse("Missing code or state.", {
			status: 400,
		});
		response.cookies.delete("oauth_state");
		return response;
	}

	const storedState = request.cookies.get("oauth_state")?.value;

	if (!storedState || storedState !== state) {
		const response = new NextResponse("Invalid state.", { status: 400 });
		response.cookies.delete("oauth_state");
		return response;
	}

	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			const response = NextResponse.redirect(
				new URL("/onboarding?error=unauthorized", request.url),
			);
			response.cookies.delete("oauth_state");
			return response;
		}
		const result = await processOAuthCallback(corsair, {
			code,
			state,
			redirectUri: REDIRECT_URI,
		});

		const [account] = await db
			.select({ id: corsairAccounts.id })
			.from(corsairAccounts)
			.innerJoin(
				corsairIntegrations,
				eq(corsairAccounts.integrationId, corsairIntegrations.id),
			)
			.where(
				and(
					eq(corsairAccounts.tenantId, session.user.id),
					eq(corsairIntegrations.name, result.plugin),
				),
			)
			.limit(1);

		if (account) {
			const eventName =
				result.plugin === "gmail"
					? "sync/gmail.connected"
					: "sync/calendar.connected";

			await inngest.send({
				name: eventName,
				data: { userId: session.user.id, accountId: account.id },
			});
		}

		const response = NextResponse.redirect(
			new URL(`/onboarding?connected=${result.plugin}`, request.url),
		);

		response.cookies.delete("oauth_state");
		return response;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error("[oauth/callback] Error:", message, error);
		const response = new NextResponse(
			process.env.NODE_ENV === "development"
				? `OAuth failed: ${message}`
				: "OAuth failed.",
			{ status: 500 },
		);
		response.cookies.delete("oauth_state");
		return response;
	}
}
