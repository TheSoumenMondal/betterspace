import { generateOAuthUrl } from "corsair/oauth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { corsair } from "@/corsair";
import { env } from "@/env";
import { getSession } from "@/server/better-auth/server";

const REDIRECT_URI = `${env.APP_URL}/api/auth/google/callback`;

export async function GET(request: NextRequest) {
	const session = await getSession();
	const tenantId = session?.user.id;

	if (!tenantId || typeof tenantId !== "string") {
		return NextResponse.json(
			{
				message: "Create a account first",
			},
			{ status: 404 },
		);
	}

	const plugin = new URL(request.url).searchParams.get("plugin") ?? "";

	if (plugin !== "gmail" && plugin !== "googlecalendar") {
		return new NextResponse("Invalid plugin Type", { status: 400 });
	}

	const { url, state } = await generateOAuthUrl(corsair, plugin, {
		tenantId,
		redirectUri: REDIRECT_URI,
	});

	const finalUrl = new URL(url);
	finalUrl.searchParams.set("login_hint", session.user.email);

	const response = NextResponse.redirect(finalUrl.toString());
	response.cookies.set("oauth_state", state, {
		httpOnly: true,
		sameSite: "lax",
		secure: env.NODE_ENV === "production",
		maxAge: 60 * 10,
		path: "/",
	});
	return response;
}
