import type * as React from "react";
import { DemoLoginAlert } from "@/components/features/demo/demo-login-alert";
import { DemoSidebar } from "@/components/features/sidebar/demo-sidebar";
import { AppNavbar } from "@/components/features/sidebar/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type Props = {
	children: React.ReactNode;
};

const layout = ({ children }: Props) => {
	const defaultOpen = true;

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<DemoSidebar />
			<SidebarInset className="flex h-svh flex-col overflow-hidden bg-sidebar shadow-none">
				<AppNavbar />
				<div className="relative flex flex-1 flex-col overflow-hidden">
					{children}
				</div>
			</SidebarInset>
			<DemoLoginAlert />
		</SidebarProvider>
	);
};

export default layout;
