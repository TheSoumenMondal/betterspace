import type { ElementType } from "react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import { AppSidebarNav } from "./app-sidebar-nav";

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

const sidebarGroups: sidebarGroupProps[] = [
	{
		groupName: "Agent",
		items: [
			{
				id: 1,
				name: "AI Space",
				icon: BrainIcon,
				link: "/space",
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
				link: "/inbox",
			},
			{
				id: 3,
				name: "Starred",
				icon: StarIcon,
				link: "/starred",
			},
			{
				id: 4,
				name: "Sent",
				icon: SendIcon,
				link: "/sent",
			},
			{
				id: 5,
				name: "Drafts",
				icon: LicenseDraftIcon,
				link: "/drafts",
			},
			{
				id: 6,
				name: "Trash",
				icon: Trash2Icon,
				link: "/trash",
			},
			{
				id: 7,
				name: "Spam",
				icon: TriangleAlertIcon,
				link: "/spam",
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
				link: "/calendar",
			},
			{
				id: 11,
				name: "Events",
				icon: CalendarDaysIcon,
				link: "/events",
			},
		],
	},
];

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
import { getSession } from "@/server/better-auth/server";
import SidebarFooterCard from "./app-sidebar-footer";

export async function AppSidebar() {
	const session = await getSession();
	const user = session?.user;
	return (
		<Sidebar className="bg-background" collapsible="icon" variant="sidebar">
			<SidebarHeader className="flex h-12 items-center justify-center border-b p-0 px-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<AppLogo
							className="flex w-full cursor-default justify-start gap-2 p-0 pl-1.5"
							logoClassName="size-5 shrink-0"
							size="icon-lg"
							textClassName="group-data-[collapsible=icon]:hidden text-sm font-anton-sc truncate"
						/>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="gap-0">
				<AppSidebarNav groups={sidebarGroups} />
			</SidebarContent>
			<SidebarFooter>
				<SidebarFooterCard user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
