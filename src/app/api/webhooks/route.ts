import { processWebhook } from "corsair";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { corsair } from "@/corsair";

export async function POST(request: NextRequest) {
	const headers: Record<string, string> = {};

	request.headers.forEach((value, key) => {
		headers[key] = value;
	});

	const body = request.headers.get("content-type")?.includes("application/json")
		? await request.json()
		: await request.text();
	let tenantId = new URL(request.url).searchParams.get("tenantId") ?? undefined;

	if (!tenantId && body?.message?.data) {
		try {
			const decodedData = Buffer.from(body.message.data, "base64").toString(
				"utf-8",
			);
			const parsedData = JSON.parse(decodedData);

			if (parsedData.emailAddress) {
				const { db } = await import("@/server/db");
				const { user } = await import("@/server/db/schema");
				const { eq } = await import("drizzle-orm");
				const foundUser = await db
					.select({ id: user.id })
					.from(user)
					.where(eq(user.email, parsedData.emailAddress))
					.limit(1);

				if (foundUser.length > 0 && foundUser[0]) {
					tenantId = foundUser[0].id;
				}
			}
		} catch (e) {
			console.error(
				"Failed to decode Gmail webhook payload for tenant resolution:",
				e,
			);
		}
	}

	const result = await processWebhook(corsair, headers, body, { tenantId });

	if (!result.response) {
		return NextResponse.json({ success: false }, { status: 404 });
	}

	return NextResponse.json(result.response);
}
