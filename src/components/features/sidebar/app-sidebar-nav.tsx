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

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild
				isActive={isActive}
				onMouseEnter={() => iconRef.current?.startAnimation?.()}
				onMouseLeave={() => iconRef.current?.stopAnimation?.()}
			>
				<Link href={item.link}>
					{Array.isArray(item.icon) ? (
						<HugeiconsIcon icon={item.icon as IconSvgElement} />
					) : (
						React.createElement(item.icon as React.ElementType, {
							size: 16,
							className: "shrink-0",
							ref: iconRef,
						})
					)}
					<span className="group-data-[collapsible=icon]:hidden">
						{item.name}
					</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
