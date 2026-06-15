"use client";

import {
	ComputerIcon,
	Moon02Icon,
	PaintBoardIcon,
	Sun01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import type { LogoutIconHandle } from "@/components/icons/logout-icon";
import { LogoutIcon } from "@/components/icons/logout-icon";
import type { UserCircleIconHandle } from "@/components/icons/user-circle-icon";
import { UserCircleIcon } from "@/components/icons/user-circle-icon";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/server/better-auth/client";

export default function SidebarFooterCard({
	user,
}: {
	user:
		| {
				id: string;
				createdAt: Date;
				updatedAt: Date;
				email: string;
				emailVerified: boolean;
				name: string;
				image?: string | null | undefined;
		  }
		| undefined;
}) {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/auth/login");
				},
			},
		});
	};

	const userIconRef = useRef<UserCircleIconHandle>(null);
	const logoutIconRef = useRef<LogoutIconHandle>(null);

	if (!user) return null;

	return (
		<SidebarMenu className="gap-1">
			<SidebarMenuItem>
				<SidebarMenuButton
					asChild
					onMouseEnter={() => userIconRef.current?.startAnimation?.()}
					onMouseLeave={() => userIconRef.current?.stopAnimation?.()}
				>
					<Link href="/settings">
						<UserCircleIcon className="size-4" ref={userIconRef} />
						<span className="group-data-[collapsible=icon]:hidden">
							Account Settings
						</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>

			<AlertDialog>
				<SidebarMenuItem>
					<AlertDialogTrigger asChild>
						<SidebarMenuButton
							onMouseEnter={() => logoutIconRef.current?.startAnimation?.()}
							onMouseLeave={() => logoutIconRef.current?.stopAnimation?.()}
						>
							<LogoutIcon className="size-4" ref={logoutIconRef} />
							<span className="group-data-[collapsible=icon]:hidden">
								Log out
							</span>
						</SidebarMenuButton>
					</AlertDialogTrigger>
				</SidebarMenuItem>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to log out?
						</AlertDialogTitle>
						<AlertDialogDescription>
							You will be redirected to the login page.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleLogout} variant={"destructive"}>
							Log out
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<SidebarMenuItem>
				<div className="flex w-full cursor-default items-center justify-between px-2 py-1.5">
					<div className="flex items-center gap-2 font-medium text-sidebar-foreground text-sm">
						<HugeiconsIcon className="size-4" icon={PaintBoardIcon} />
						<span className="group-data-[collapsible=icon]:hidden">Theme</span>
					</div>

					<div className="flex items-center gap-0.5 rounded-full border border-sidebar-border bg-sidebar-accent/50 p-0.5 group-data-[collapsible=icon]:hidden">
						<button
							className={`rounded-full p-1 transition-colors ${mounted && theme === "dark" ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "text-sidebar-foreground/60 hover:text-sidebar-foreground"}`}
							onClick={(e) => {
								e.preventDefault();
								setTheme("dark");
							}}
							type="button"
						>
							<HugeiconsIcon className="size-3" icon={Moon02Icon} />
						</button>
						<button
							className={`rounded-full p-1 transition-colors ${mounted && theme === "light" ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "text-sidebar-foreground/60 hover:text-sidebar-foreground"}`}
							onClick={(e) => {
								e.preventDefault();
								setTheme("light");
							}}
							type="button"
						>
							<HugeiconsIcon className="size-3" icon={Sun01Icon} />
						</button>
						<button
							className={`rounded-full p-1 transition-colors ${mounted && theme === "system" ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "text-sidebar-foreground/60 hover:text-sidebar-foreground"}`}
							onClick={(e) => {
								e.preventDefault();
								setTheme("system");
							}}
							type="button"
						>
							<HugeiconsIcon className="size-3" icon={ComputerIcon} />
						</button>
					</div>
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
