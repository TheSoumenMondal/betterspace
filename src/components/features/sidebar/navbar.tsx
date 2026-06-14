"use client";

import {
	PanelLeftCloseIcon,
	PanelLeftOpenIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavSlot } from "./navslot-context";

const segmentLabels: Record<string, string> = {
	space: "AI Space",
	inbox: "Inbox",
	starred: "Starred",
	sent: "Sent",
	drafts: "Drafts",
	trash: "Trash",
	spam: "Spam",
	events: "Events",
	reminders: "Reminders",
	tasks: "Tasks",
	mail: "Mail",
	calendar: "Calendar",
	settings: "Settings",
};

function Breadcrumb({ pathname }: { pathname: string }) {
	const segments = pathname.split("/").filter(Boolean);

	if (segments.length === 0) {
		return <span className="font-medium text-foreground text-sm">Home</span>;
	}

	return (
		<nav aria-label="Breadcrumb">
			<ol className="flex items-center gap-1.5 text-sm">
				{segments.map((segment, index) => {
					const isLast = index === segments.length - 1;
					const href = `/${segments.slice(0, index + 1).join("/")}`;
					const label =
						segmentLabels[segment] ??
						`${segment.charAt(0).toUpperCase()}${segment.slice(1)}`;

					return (
						<li className="flex items-center gap-1.5" key={href}>
							{index > 0 && (
								<span className="select-none text-muted-foreground/50">/</span>
							)}
							{isLast ? (
								<span className="font-medium text-foreground">{label}</span>
							) : (
								<Link
									className="text-muted-foreground transition-colors hover:text-foreground"
									href={href}
								>
									{label}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

export function AppNavbar() {
	const { toggleSidebar, open } = useSidebar();
	const pathname = usePathname();
	const { navSlot } = useNavSlot();

	return (
		<header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-3 border-b bg-sidebar px-2">
			<Button
				aria-label="Toggle Sidebar"
				className="cursor-pointer"
				onClick={toggleSidebar}
				size="icon-sm"
				variant="ghost"
			>
				<HugeiconsIcon
					className="size-4"
					icon={open ? PanelLeftOpenIcon : PanelLeftCloseIcon}
				/>
			</Button>
			<div className="h-4 w-px bg-border" />
			<Breadcrumb pathname={pathname} />

			{navSlot && (
				<>
					<div className="mx-1 h-4 w-px bg-border" />
					<div className="flex min-w-0 flex-1 items-center gap-2">
						{navSlot}
					</div>
				</>
			)}
		</header>
	);
}
