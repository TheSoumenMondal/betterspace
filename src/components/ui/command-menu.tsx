"use client";

import {
	AiBrain01Icon,
	Alert01Icon,
	Calendar01Icon,
	Calendar03Icon,
	CommandIcon,
	ComputerIcon,
	Delete02Icon,
	Mail01Icon,
	Moon02Icon,
	Note01Icon,
	SentIcon,
	Settings01Icon,
	StarIcon,
	Sun03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button-2";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "./kbd";

export function CommandMenu() {
	const [open, setOpen] = React.useState(false);
	const router = useRouter();
	const { setTheme } = useTheme();

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const runCommand = React.useCallback((command: () => unknown) => {
		setOpen(false);
		command();
	}, []);

	return (
		<>
			<Button
				className="relative h-8 w-28 rounded-[0.5rem] bg-muted/50 px-2 font-normal text-muted-foreground text-sm shadow-none md:w-40 md:justify-start md:px-3 md:pr-12 lg:w-56"
				onClick={() => setOpen(true)}
				size="sm"
				variant="outline"
			>
				<span className="inline-flex truncate">Search...</span>
				<KbdGroup className="hidden md:absolute md:top-[0.3rem] md:right-[0.3rem] md:flex">
					<Kbd>
						<HugeiconsIcon icon={CommandIcon} />
					</Kbd>
					<Kbd>K</Kbd>
				</KbdGroup>
			</Button>
			<CommandDialog onOpenChange={setOpen} open={open}>
				<CommandInput placeholder="Search for anything you want" />
				<CommandList className="py-2">
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup>
						<CommandItem
							onSelect={() => runCommand(() => router.push("/space"))}
						>
							<HugeiconsIcon className="mr-1" icon={AiBrain01Icon} size={8} />
							<span className="font-medium font-sans text-xs">New Chat</span>
							<CommandShortcut>
								<Button size="icon-xs" variant="raised">
									s
								</Button>
							</CommandShortcut>
						</CommandItem>
						<CommandItem
							onSelect={() => runCommand(() => router.push("/inbox"))}
						>
							<HugeiconsIcon className="mr-1" icon={Mail01Icon} size={8} />
							<span className="font-medium font-sans text-xs">Inbox</span>
							<CommandShortcut>
								<Button size="icon-xs" variant="raised">
									i
								</Button>
							</CommandShortcut>
						</CommandItem>
						<CommandItem
							onSelect={() => runCommand(() => router.push("/calendar"))}
						>
							<HugeiconsIcon className="mr-1" icon={Calendar01Icon} size={8} />
							<span className="font-medium font-sans text-xs">Calendar</span>
							<CommandShortcut>
								<Button size="icon-xs" variant="raised">
									c
								</Button>
							</CommandShortcut>
						</CommandItem>
						<CommandItem
							onSelect={() => runCommand(() => router.push("/events"))}
						>
							<HugeiconsIcon className="mr-1" icon={Calendar03Icon} size={8} />
							<span className="font-medium font-sans text-xs">Events</span>
							<CommandShortcut>
								<Button size="icon-xs" variant="raised">
									e
								</Button>
							</CommandShortcut>
						</CommandItem>
						<CommandItem
							onSelect={() => runCommand(() => router.push("/starred"))}
						>
							<HugeiconsIcon className="mr-1" icon={StarIcon} size={8} />
							<span className="font-medium font-sans text-xs">Starred</span>
						</CommandItem>
						<CommandItem
							onSelect={() => runCommand(() => router.push("/sent"))}
						>
							<HugeiconsIcon className="mr-1" icon={SentIcon} size={8} />
							<span className="font-medium font-sans text-xs">Sent</span>
						</CommandItem>
						<CommandItem
							onSelect={() => runCommand(() => router.push("/drafts"))}
						>
							<HugeiconsIcon className="mr-1" icon={Note01Icon} size={8} />
							<span className="font-medium font-sans text-xs">Drafts</span>
						</CommandItem>
						<CommandItem
							onSelect={() => runCommand(() => router.push("/spam"))}
						>
							<HugeiconsIcon className="mr-1" icon={Alert01Icon} size={8} />
							<span className="font-medium font-sans text-xs">Spam</span>
						</CommandItem>
						<CommandItem
							onSelect={() => runCommand(() => router.push("/trash"))}
						>
							<HugeiconsIcon className="mr-1" icon={Delete02Icon} size={8} />
							<span className="font-medium font-sans text-xs">Trash</span>
						</CommandItem>
						<CommandItem
							onSelect={() => runCommand(() => router.push("/settings"))}
						>
							<HugeiconsIcon className="mr-1" icon={Settings01Icon} size={8} />
							<span className="font-medium font-sans text-xs">Settings</span>
						</CommandItem>
						<CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
							<HugeiconsIcon className="mr-1" icon={Sun03Icon} size={8} />
							<span className="font-medium font-sans text-xs">Light Theme</span>
						</CommandItem>
						<CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
							<HugeiconsIcon className="mr-1" icon={Moon02Icon} size={8} />
							<span className="font-medium font-sans text-xs">Dark Theme</span>
						</CommandItem>
						<CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
							<HugeiconsIcon className="mr-1" icon={ComputerIcon} size={8} />
							<span className="font-medium font-sans text-xs">
								System Theme
							</span>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
