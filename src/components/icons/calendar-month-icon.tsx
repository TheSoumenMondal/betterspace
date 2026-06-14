"use client";

import {
	domMin,
	LazyMotion,
	m,
	useAnimation,
	useReducedMotion,
} from "motion/react";
import {
	forwardRef,
	type HTMLAttributes,
	useCallback,
	useImperativeHandle,
	useRef,
} from "react";
import { cn } from "@/lib/utils";

export interface CalendarMonthIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface CalendarMonthIconProps
	extends Omit<
		HTMLAttributes<HTMLDivElement>,
		| "color"
		| "onDrag"
		| "onDragStart"
		| "onDragEnd"
		| "onAnimationStart"
		| "onAnimationEnd"
		| "onAnimationIteration"
	> {
	size?: number;
	color?: string;
}

const CalendarMonthIcon = forwardRef<
	CalendarMonthIconHandle,
	CalendarMonthIconProps
>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 24, color, ...props },
		ref,
	) => {
		const controls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => (reduced ? undefined : controls.start("animate")),
				stopAnimation: () => controls.start("normal"),
			};
		});

		const handleEnter = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					if (!reduced) controls.start("animate");
				} else {
					onMouseEnter?.(e);
				}
			},
			[controls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					controls.start("normal");
				} else {
					onMouseLeave?.(e);
				}
			},
			[controls, onMouseLeave],
		);

		return (
			<LazyMotion features={domMin} strict>
				<m.div
					className={cn("relative inline-flex", className)}
					onMouseEnter={handleEnter}
					onMouseLeave={handleLeave}
					{...props}
					style={{ color, ...props.style }}
				>
					{/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon */}
					<svg
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
						{/* Calendar body */}
						<path d="M16 2V6M8 2V6" />
						<path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V16C3 19.7712 3 21.6569 4.17157 22.8284C5.34315 24 7.22876 24 11 24H13C16.7712 24 18.6569 24 19.8284 22.8284C21 21.6569 21 19.7712 21 16V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" />
						<path d="M3 10H21" />
						{/* Dot grid (3×2 dots representing month grid) */}
						<m.g
							animate={controls}
							initial="normal"
							variants={{
								normal: { opacity: 1, y: 0 },
								animate: {
									opacity: [1, 0.4, 1],
									transition: { duration: 0.7, ease: "easeInOut" },
								},
							}}
						>
							<circle cx="8" cy="14" fill="currentColor" r="1" stroke="none" />
							<circle cx="12" cy="14" fill="currentColor" r="1" stroke="none" />
							<circle cx="16" cy="14" fill="currentColor" r="1" stroke="none" />
							<circle cx="8" cy="18" fill="currentColor" r="1" stroke="none" />
							<circle cx="12" cy="18" fill="currentColor" r="1" stroke="none" />
							<circle cx="16" cy="18" fill="currentColor" r="1" stroke="none" />
						</m.g>
					</svg>
				</m.div>
			</LazyMotion>
		);
	},
);

CalendarMonthIcon.displayName = "CalendarMonthIcon";

export { CalendarMonthIcon };
