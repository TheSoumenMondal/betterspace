import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 cursor-pointer select-none appearance-none items-center justify-center gap-2! whitespace-nowrap rounded-lg border border-transparent font-medium text-xs/relaxed outline-none focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 disabled:opacity-50 aria-expanded:ring-[2px] aria-expanded:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-[2px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"inset-shadow-2xs inset-shadow-white/25 border border-primary bg-background bg-radial-[at_52%_-52%] from-primary/70 to-primary/95 text-primary-foreground shadow-md shadow-zinc-950/30 [text-shadow:0_1px_0_var(--color-primary)] hover:brightness-110 active:brightness-95",
				secondary:
					"border border-zinc-300 bg-background bg-linear-to-t from-muted to-sidebar text-foreground shadow-xs shadow-zinc-950/10 hover:brightness-[0.97] dark:border-border dark:from-muted/50",
				decorations:
					"border border-zinc-300 bg-background text-foreground shadow-xs shadow-zinc-950/10 hover:bg-muted dark:border-border",
				muted:
					"bg-muted text-foreground shadow-zinc-950/10 duration-200 hover:bg-neutral-200 dark:hover:bg-accent",
				outline:
					"border-border hover:text-foreground hover:brightness-[0.97] aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-input/20 dark:bg-input/30",
				ghost:
					"hover:bg-neutral-200 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-accent",
				info: "inset-shadow-2xs inset-shadow-white/25 border border-0 border-zinc-950/35 bg-linear-to-b from-blue-600/85 to-blue-600 text-white shadow-md shadow-zinc-950/20 [text-shadow:0_1px_0_var(--color-blue-800)] hover:brightness-110 active:brightness-95",
				success:
					"inset-shadow-2xs inset-shadow-white/25 border border-0 border-zinc-950/35 bg-linear-to-b from-emerald-600/85 to-emerald-600 text-white shadow-md shadow-zinc-950/20 [text-shadow:0_1px_0_var(--color-emerald-800)] hover:brightness-110 active:brightness-95",
				warning:
					"inset-shadow-2xs inset-shadow-white/25 border border-0 border-zinc-950/35 bg-linear-to-b from-amber-600/85 to-amber-600 text-white shadow-md shadow-zinc-950/20 [text-shadow:0_1px_0_var(--color-amber-800)] hover:brightness-110 active:brightness-95",
				destructive:
					"border border-red-800 border-zinc-950/40 border-b-2 bg-linear-to-t from-destructive to-destructive/85 text-white shadow-md shadow-zinc-950/20 ring-1 ring-white/25 ring-inset hover:brightness-110 active:brightness-90",
				raised:
					"relative border-input/50 border-b-2 bg-background text-foreground shadow-sm shadow-zinc-950/15 ring-0 ring-zinc-300 [text-shadow:0_1px_0_var(--color-zinc-100)] hover:bg-zinc-50 dark:ring-zinc-700 dark:hover:bg-neutral-900 dark:[text-shadow:0_1px_0_var(--color-zinc-900)]",
				link: "!px-0 !pb-0 group relative text-primary underline-offset-4 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-[width] after:duration-150 hover:after:w-full [&_svg]:text-muted-foreground [&_svg]:group-hover:text-foreground",
			},

			size: {
				default:
					"h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
				xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
				sm: "h-6 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
				lg: "h-8 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
				icon: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
				"icon-xs": "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
				"icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
				"icon-lg": "size-8 [&_svg:not([class*='size-'])]:size-4",
			},
			animation: {
				all: "duration-150 [transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,outline-color,--tw-gradient-from,--tw-gradient-to] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]",
				colors:
					"duration-150 [transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-to] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]",
				none: "",
				"only-scale":
					"duration-150 [transition-property:transform] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			animation: "all",
		},
	},
);

function Button({
	className = "",
	variant = "default",
	size = "default",
	animation = "all",
	children,
	...props
}: React.ComponentProps<"button"> & {
	className?: string;
	variant?:
		| "default"
		| "secondary"
		| "decorations"
		| "muted"
		| "outline"
		| "ghost"
		| "info"
		| "success"
		| "warning"
		| "destructive"
		| "raised"
		| "link";
	size?:
		| "default"
		| "xs"
		| "sm"
		| "lg"
		| "icon"
		| "icon-xs"
		| "icon-sm"
		| "icon-lg";
	animation?: "all" | "colors" | "none" | "only-scale";
	children?: React.ReactNode;
}) {
	return (
		<ButtonPrimitive
			className={cn(
				buttonVariants({ variant, size, animation, className }),
				variant === "decorations" && "relative overflow-visible rounded-none",
			)}
			data-slot="button"
			{...props}
		>
			{children}
			{variant === "decorations" && (
				<div className={cn("absolute -top-px -left-px z-10")}>
					<div className="relative">
						<div className="absolute top-0 h-1.25 w-px rounded-full bg-muted-foreground" />
						<div className="absolute left-0 h-px w-1.25 rounded-full bg-muted-foreground" />
					</div>
				</div>
			)}

			{variant === "decorations" && (
				<div className={cn("absolute -top-px right-0 z-10")}>
					<div className="relative">
						<div className="absolute top-0 h-1.25 w-px rounded-full bg-muted-foreground" />
						<div className="absolute left-[-4.5px] h-px w-1.25 rounded-full bg-muted-foreground" />
					</div>
				</div>
			)}

			{variant === "decorations" && (
				<div className={cn("absolute bottom-0 -left-px z-10")}>
					<div className="relative">
						<div className="absolute top-[-4.5px] h-1.25 w-px rounded-full bg-muted-foreground" />
						<div className="absolute left-0 h-px w-1.25 rounded-full bg-muted-foreground" />
					</div>
				</div>
			)}

			{variant === "decorations" && (
				<div className={cn("absolute right-0 bottom-0 z-10")}>
					<div className="relative">
						<div className="absolute top-[-4.5px] h-1.25 w-px rounded-full bg-muted-foreground" />
						<div className="absolute left-[-4.5px] h-px w-1.25 rounded-full bg-muted-foreground" />
					</div>
				</div>
			)}
		</ButtonPrimitive>
	);
}

Button.displayName = "Button";

export { Button, buttonVariants };
