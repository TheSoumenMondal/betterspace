"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { type ElementType } from "react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { api } from "@/trpc/react";

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

export function AppSidebarNav({ groups }: { groups: sidebarGroupProps[] }) {
	const pathname = usePathname();

	return (
		<>
			{groups.map((group) => (
				<SidebarGroup key={group.groupName}>
					<SidebarGroupLabel>{group.groupName}</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{group.items.map((item) => (
								<NavItem
									isActive={pathname.startsWith(item.link)}
									item={item}
									key={item.id}
								/>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			))}
		</>
	);
}

function NavItem({
	item,
	isActive,
}: {
	item: sidebarItemProps;
	isActive: boolean;
}) {
	const iconRef = React.useRef<{
		startAnimation: () => void;
		stopAnimation: () => void;
	} | null>(null);

	const unreadQuery = api.gmail.getUnreadCount.useQuery(undefined, {
		enabled: item.name === "Inbox",
		refetchInterval: 30000,
	});

	const unreadCount = unreadQuery.data?.count ?? 0;

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild
				isActive={isActive}
				onMouseEnter={() => iconRef.current?.startAnimation?.()}
				onMouseLeave={() => iconRef.current?.stopAnimation?.()}
			>
				<Link href={item.link}>
					<div className="relative flex shrink-0 items-center justify-center">
						{Array.isArray(item.icon) ? (
							<HugeiconsIcon icon={item.icon as IconSvgElement} />
						) : (
							React.createElement(item.icon as React.ElementType, {
								size: 16,
								className: "shrink-0",
								ref: iconRef,
							})
						)}
						{item.name === "Inbox" && unreadCount > 0 && (
							<span className="absolute -top-1 -right-1 hidden h-2 w-2 rounded-full bg-blue-600 ring-2 ring-background group-data-[collapsible=icon]:block" />
						)}
					</div>

					<span className="flex-1 group-data-[collapsible=icon]:hidden">
						{item.name}
					</span>

					{item.name === "Inbox" && unreadCount > 0 && (
						<div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 font-medium text-[10px] text-white group-data-[collapsible=icon]:hidden">
							{unreadCount > 99 ? "99+" : unreadCount}
						</div>
					)}
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
