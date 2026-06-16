"use client";

import type { Variants } from "motion/react";
import {
	domMin,
	LazyMotion,
	m,
	useAnimation,
	useReducedMotion,
} from "motion/react";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface IconTileProps {
	children: (controls: ReturnType<typeof useAnimation>) => React.ReactNode;
	className?: string;
}

function IconTile({ children, className }: IconTileProps) {
	const controls = useAnimation();
	const reduced = useReducedMotion();

	const handleEnter = useCallback(() => {
		if (reduced) return;
		controls.start("animate");
	}, [controls, reduced]);

	const handleLeave = useCallback(() => {
		controls.start("normal");
	}, [controls]);

	return (
		<LazyMotion features={domMin} strict>
			<m.div
				className={cn(
					"shrink-0 cursor-default rounded-lg bg-muted/50 p-2",
					className,
				)}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
			>
				{children(controls)}
			</m.div>
		</LazyMotion>
	);
}

export function AnimatedLocationIcon({ size = 16 }: { size?: number }) {
	const pinVariants: Variants = {
		normal: { y: 0 },
		animate: {
			y: [0, 3, -2, 0],
			transition: { duration: 0.45, ease: "easeOut" },
		},
	};

	return (
		<IconTile>
			{(controls) => (
				<svg
					aria-hidden="true"
					className="text-muted-foreground"
					fill="none"
					height={size}
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
					viewBox="0 0 24 24"
					width={size}
					xmlns="http://www.w3.org/2000/svg"
				>
					<m.g animate={controls} initial="normal" variants={pinVariants}>
						<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
						<circle cx="12" cy="9" r="2.5" />
					</m.g>
				</svg>
			)}
		</IconTile>
	);
}

export function AnimatedVideoIcon({ size = 16 }: { size?: number }) {
	const bodyVariants: Variants = {
		normal: { x: 0 },
		animate: {
			x: [0, -2, 1, 0],
			transition: { duration: 0.4, ease: "easeInOut" },
		},
	};

	return (
		<IconTile>
			{(controls) => (
				<svg
					aria-hidden="true"
					className="text-muted-foreground"
					fill="none"
					height={size}
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
					viewBox="0 0 24 24"
					width={size}
					xmlns="http://www.w3.org/2000/svg"
				>
					<m.rect
						animate={controls}
						height="10"
						initial="normal"
						rx="2"
						variants={bodyVariants}
						width="13"
						x="2"
						y="7"
					/>
					<path d="M15 9.5l5-3v11l-5-3" />
				</svg>
			)}
		</IconTile>
	);
}

export function AnimatedUsersIcon({ size = 16 }: { size?: number }) {
	const leftVariants: Variants = {
		normal: { x: 0 },
		animate: {
			x: [0, -2, 0],
			transition: { duration: 0.35, ease: "easeInOut" },
		},
	};
	const rightVariants: Variants = {
		normal: { x: 0 },
		animate: {
			x: [0, 2, 0],
			transition: { duration: 0.35, ease: "easeInOut" },
		},
	};

	return (
		<IconTile>
			{(controls) => (
				<svg
					aria-hidden="true"
					className="text-muted-foreground"
					fill="none"
					height={size}
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
					viewBox="0 0 24 24"
					width={size}
					xmlns="http://www.w3.org/2000/svg"
				>
					<m.g animate={controls} initial="normal" variants={leftVariants}>
						<circle cx="9" cy="7" r="3" />
						<path d="M3 21v-1a6 6 0 0 1 6-6h0" />
					</m.g>
					<m.g animate={controls} initial="normal" variants={rightVariants}>
						<circle cx="15" cy="7" r="3" />
						<path d="M21 21v-1a6 6 0 0 0-6-6h0" />
					</m.g>
				</svg>
			)}
		</IconTile>
	);
}

export function AnimatedCalendarIcon({ size = 16 }: { size?: number }) {
	const calendarVariants: Variants = {
		normal: { y: 0, rotate: 0 },
		animate: {
			y: [0, -2, 0],
			rotate: [0, -3, 3, 0],
			transition: { duration: 0.5, ease: "easeInOut" },
		},
	};

	return (
		<IconTile>
			{(controls) => (
				<svg
					aria-hidden="true"
					className="text-muted-foreground"
					fill="none"
					height={size}
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
					viewBox="0 0 24 24"
					width={size}
					xmlns="http://www.w3.org/2000/svg"
				>
					<m.g animate={controls} initial="normal" variants={calendarVariants}>
						<rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
						<line x1="16" x2="16" y1="2" y2="6" />
						<line x1="8" x2="8" y1="2" y2="6" />
						<line x1="3" x2="21" y1="10" y2="10" />
					</m.g>
				</svg>
			)}
		</IconTile>
	);
}
