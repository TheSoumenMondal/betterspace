"use client";

import {
	ArrowUpRight01Icon,
	Menu02FreeIcons,
	PanelLeftCloseIcon,
	PanelLeftOpenIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button-2";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useSidebar } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/trpc/react";
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
	const isConversationRoute = /^\/space\/[^/]+$/.test(pathname);
	const isSpaceRoute = pathname.startsWith("/space");
	const [sheetOpen, setSheetOpen] = useState(false);

	const { data: conversations, isLoading } = api.chat.history.useQuery(
		undefined,
		{
			enabled: isSpaceRoute,
		},
	);

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
			{!isConversationRoute && <div className="h-4 w-px bg-border" />}
			{isConversationRoute ? (
				<div className="pointer-events-none absolute left-1/2 w-full max-w-[50%] -translate-x-1/2 text-center">
					{navSlot ?? (
						<span className="font-medium text-foreground text-sm">
							Conversation
						</span>
					)}
				</div>
			) : (
				<Breadcrumb pathname={pathname} />
			)}

			{!isConversationRoute && navSlot && (
				<>
					<div className="mx-1 h-4 w-px bg-border" />
					<div className="flex min-w-0 flex-1 items-center gap-2">
						{navSlot}
					</div>
				</>
			)}

			<div className="flex-1" />

			{isSpaceRoute && (
				<Sheet onOpenChange={setSheetOpen} open={sheetOpen}>
					<TooltipProvider delayDuration={300}>
						<Tooltip>
							<TooltipTrigger asChild>
								<SheetTrigger asChild>
									<Button size="icon" variant="ghost">
										<HugeiconsIcon icon={Menu02FreeIcons} />
									</Button>
								</SheetTrigger>
							</TooltipTrigger>
							<TooltipContent align="end" side="bottom">
								Previous conversations
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<SheetContent className="w-70 px-0 sm:w-85" showCloseButton={false}>
						<SheetHeader className="flex flex-row items-center justify-between space-y-0 border-b px-5 py-4">
							<SheetTitle className="mt-1 font-copper-bt-regular text-lg leading-none">
								Your previous conversations
							</SheetTitle>
							<SheetClose asChild>
								<Button size="icon-sm" variant="ghost">
									<XIcon className="size-4" />
									<span className="sr-only">Close</span>
								</Button>
							</SheetClose>
						</SheetHeader>
						<div className="flex flex-col gap-1 overflow-y-auto px-5">
							{isLoading ? (
								<p className="flex h-full w-full items-center justify-center">
									<Spinner />
								</p>
							) : conversations?.length === 0 ? (
								<p className="text-muted-foreground text-sm">
									No previous conversations.
								</p>
							) : (
								conversations?.map((conversation) => (
									<Link
										className="group block py-1.5"
										href={`/space/${conversation.id}`}
										key={conversation.id}
										onClick={() => setSheetOpen(false)}
									>
										<motion.div
											className="flex items-center justify-between gap-2"
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 25,
											}}
											whileHover={{ x: 4 }}
										>
											<span className="truncate font-geist-mono font-semibold text-muted-foreground text-xs uppercase transition-colors group-hover:text-foreground">
												{conversation.title || "New conversation"}
											</span>
											<HugeiconsIcon
												className="size-3.5 shrink-0 text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
												icon={ArrowUpRight01Icon}
											/>
										</motion.div>
									</Link>
								))
							)}
						</div>
					</SheetContent>
				</Sheet>
			)}
		</header>
	);
}
