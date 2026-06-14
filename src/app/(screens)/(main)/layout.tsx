import type * as React from "react";
import { AppSidebar } from "@/components/features/sidebar/app-sidebar";
import { AppNavbar } from "@/components/features/sidebar/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type Props = {
	children: React.ReactNode;
};

const layout = ({ children }: Props) => {
	return (
		<SidebarProvider>
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
