import { redirect } from "next/navigation";
import type React from "react";
import { getSession } from "@/server/better-auth/server";

export default async function SpaceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();
	if (session && !session.user.hasCompletedOnboarding) {
		redirect("/onboarding");
	}

	return <>{children}</>;
}
