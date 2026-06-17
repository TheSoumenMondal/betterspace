"use client";

import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import type * as React from "react";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogPopup,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function Command({
	className = "",
	...props
}: React.ComponentProps<typeof CommandPrimitive>) {
	return (
		<CommandPrimitive
			className={cn(
				"flex h-full w-full flex-col overflow-hidden rounded-2xl bg-popover text-popover-foreground",
				className,
			)}
			data-slot="command"
			{...props}
		/>
	);
}

function CommandDialog({
	title = "Command Palette",
	description = "Search for a command to run...",
	children = null,
	className = "",
	showCloseButton = false,
	...props
}: React.ComponentProps<typeof Dialog> & {
	title?: string;
	description?: string;
	className?: string;
	showCloseButton?: boolean;
}) {
	return (
		<Dialog {...props}>
			<DialogPopup
				className={cn(
					"overflow-hidden border-0 bg-transparent p-0 shadow-none sm:max-w-150",
					className,
				)}
				containerClassName="p-0 gap-0"
				showCloseButton={showCloseButton}
			>
				<DialogHeader className="sr-only">
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<Command className="**:data-[slot=command-input-wrapper]:h-12 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground **:[[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 **:[[cmdk-group]]:px-2 **:[[cmdk-input-wrapper]_svg]:h-5 **:[[cmdk-input-wrapper]_svg]:w-5 **:[[cmdk-input]]:h-12 **:[[cmdk-item]]:px-2 **:[[cmdk-item]_svg]:h-5 **:[[cmdk-item]_svg]:w-5">
					{children}
				</Command>
			</DialogPopup>
		</Dialog>
	);
}

function CommandInput({
	className = "",
	...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
	return (
		<div
			className="flex h-9 items-center gap-2 border-b bg-background px-3"
			data-slot="command-input-wrapper"
		>
			<SearchIcon className="size-4 shrink-0 opacity-50" />
			<CommandPrimitive.Input
				className={cn(
					"flex h-10 w-full rounded-xl bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				data-slot="command-input"
				{...props}
			/>
		</div>
	);
}

function CommandList({
	className = "",
	...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
	return (
		<CommandPrimitive.List
			className={cn(
				"no-scrollbar max-h-75 scroll-py-1 overflow-y-auto overflow-x-hidden outline-none",
				className,
			)}
			data-slot="command-list"
			{...props}
		/>
	);
}

function CommandEmpty({
	...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
	return (
		<CommandPrimitive.Empty
			className="py-6 text-center text-sm"
			data-slot="command-empty"
			{...props}
		/>
	);
}

function CommandGroup({
	className = "",
	...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
	return (
		<CommandPrimitive.Group
			className={cn(
				"overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground **:[[cmdk-group-heading]]:text-xs",
				"data-[hidden=true]:hidden",
				className,
			)}
			data-slot="command-group"
			{...props}
		/>
	);
}

function CommandSeparator({
	className = "",
	...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
	return (
		<CommandPrimitive.Separator
			className={cn(
				"-mx-1 h-px bg-border data-[hidden=true]:hidden",
				className,
			)}
			data-slot="command-separator"
			{...props}
		/>
	);
}

function CommandItem({
	className = "",
	...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
	return (
		<CommandPrimitive.Item
			className={cn(
				"relative flex cursor-default select-none items-center gap-2 rounded-lg px-2 py-2 text-sm outline-hidden data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 **:[svg:not([class*='size-'])]:size-4 **:[svg:not([class*='text-'])]:text-muted-foreground **:[svg]:pointer-events-none **:[svg]:shrink-0",
				"data-[hidden=true]:hidden",
				className,
			)}
			data-slot="command-item"
			{...props}
		/>
	);
}

function CommandShortcut({
	className = "",
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"ml-auto text-muted-foreground text-xs tracking-widest",
				className,
			)}
			data-slot="command-shortcut"
			{...props}
		/>
	);
}

Command.displayName = "Command";
CommandDialog.displayName = "CommandDialog";
CommandInput.displayName = "CommandInput";
CommandList.displayName = "CommandList";
CommandEmpty.displayName = "CommandEmpty";
CommandGroup.displayName = "CommandGroup";
CommandItem.displayName = "CommandItem";
CommandShortcut.displayName = "CommandShortcut";
CommandSeparator.displayName = "CommandSeparator";

export {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
};
