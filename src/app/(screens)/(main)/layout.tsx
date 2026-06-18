import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type * as React from "react";
import { AppSidebar } from "@/components/features/sidebar/app-sidebar";
import { AppNavbar } from "@/components/features/sidebar/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/server/better-auth/server";

type Props = {
	children: React.ReactNode;
};

const layout = async ({ children }: Props) => {
	const session = await getSession();
	if (
		!(session?.user as { hasCompletedOnboarding?: boolean })
			?.hasCompletedOnboarding
	) {
		redirect("/onboarding");
	}

	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar />
			<SidebarInset className="flex h-svh flex-col overflow-hidden bg-sidebar shadow-none">
				<AppNavbar />
				<div className="relative flex flex-1 flex-col overflow-hidden">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default layout;
