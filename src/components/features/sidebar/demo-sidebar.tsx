import { LogInIcon } from "lucide-react";
import Link from "next/link";
import type { ElementType } from "react";
import { Button } from "@/components/ui/button-2";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import { DemoSidebarNav } from "./demo-sidebar-nav";

type IconSvgElement = readonly (readonly [
	string,
	{
		readonly [key: string]: string | number;
	},
])[];

type sidebarItemProps = {
	id: number;
	name: string;
	icon: ElementType<{ className?: string; size?: number }> | IconSvgElement;
	link: string;
	children?: sidebarItemProps[];
};

type sidebarGroupProps = {
	groupName: string;
	items: sidebarItemProps[];
};

import { BrainIcon } from "@/components/icons/brain-icon";
import { CalendarDaysIcon } from "@/components/icons/calendar-days";
import { CalendarMonthIcon } from "@/components/icons/calendar-month-icon";
import { LicenseDraftIcon } from "@/components/icons/license-draft-icon";
import { MailIcon } from "@/components/icons/mail-icon";
import { SendIcon } from "@/components/icons/send-icon";
import { StarIcon } from "@/components/icons/star-icon";
import { Trash2Icon } from "@/components/icons/trash-2-icon";
import { TriangleAlertIcon } from "@/components/icons/triangle-alert-icon";
import AppLogo from "@/components/shared/app-logo";

const demoSidebarGroups: sidebarGroupProps[] = [
	{
		groupName: "Agent",
		items: [
			{
				id: 1,
				name: "AI Space (Demo)",
				icon: BrainIcon,
				link: "/demo/space",
			},
		],
	},
	{
		groupName: "Mail",
		items: [
			{
				id: 2,
				name: "Inbox",
				icon: MailIcon,
				link: "/demo/inbox",
			},
			{
				id: 3,
				name: "Starred",
				icon: StarIcon,
				link: "/demo/starred",
			},
			{
				id: 4,
				name: "Sent",
				icon: SendIcon,
				link: "/demo/sent",
			},
			{
				id: 5,
				name: "Drafts",
				icon: LicenseDraftIcon,
				link: "/demo/drafts",
			},
			{
				id: 6,
				name: "Trash",
				icon: Trash2Icon,
				link: "/demo/trash",
			},
			{
				id: 7,
				name: "Spam",
				icon: TriangleAlertIcon,
				link: "/demo/spam",
			},
		],
	},
	{
		groupName: "Calendar",
		items: [
			{
				id: 8,
				name: "Calendar",
				icon: CalendarMonthIcon,
				link: "/demo/calendar",
			},
			{
				id: 11,
				name: "Events",
				icon: CalendarDaysIcon,
				link: "/demo/events",
			},
		],
	},
];

export function DemoSidebar() {
	return (
		<Sidebar className="bg-background" collapsible="icon" variant="sidebar">
			<SidebarHeader className="flex h-12 items-center justify-center border-b p-0 px-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<Link href="/">
							<AppLogo
								className="flex w-full cursor-pointer justify-start gap-2 p-0 pl-1.5"
								logoClassName="size-5 shrink-0"
								size="icon-lg"
								textClassName="group-data-[collapsible=icon]:hidden text-sm font-anton-sc truncate"
							/>
						</Link>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="gap-0">
				<DemoSidebarNav groups={demoSidebarGroups} />
			</SidebarContent>
			<SidebarFooter className="p-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<Link className="flex w-full" href="/auth/login">
							<Button className="w-full justify-start" variant="info">
								<LogInIcon />
								<span className="truncate group-data-[collapsible=icon]:hidden">
									Login to access all features
								</span>
							</Button>
						</Link>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
