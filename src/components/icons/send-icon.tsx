"use client";

import type { Variants } from "motion/react";
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
	type MouseEvent,
	useCallback,
	useImperativeHandle,
	useRef,
} from "react";
import { cn } from "@/lib/utils";

export interface SendIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface SendIconProps
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
	duration?: number;
	isAnimated?: boolean;
	color?: string;
}

const SendIcon = forwardRef<SendIconHandle, SendIconProps>(
	(
		{
			onMouseEnter,
			onMouseLeave,
			className,
			size = 24,
			duration = 1,
			isAnimated = true,
			color,
			...props
		},
		ref,
	) => {
		const controls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () =>
					reduced ? controls.start("normal") : controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			};
		});

		const handleEnter = useCallback(
			(e?: MouseEvent<HTMLDivElement>) => {
				if (!isAnimated || reduced) return;
				if (!isControlled.current) controls.start("animate");
				else onMouseEnter?.(e as MouseEvent<HTMLDivElement>);
			},
			[controls, reduced, isAnimated, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) controls.start("normal");
				else onMouseLeave?.(e as MouseEvent<HTMLDivElement>);
			},
			[controls, onMouseLeave],
		);

		const svgVariants: Variants = {
			normal: {
				x: 0,
				y: 0,
				scale: 1,
				opacity: 1,
			},
			animate: {
				scale: [1, 0.85, 0, 0, 1],
				x: [0, 6, 16, -16, 0],
				y: [0, -4, -16, 16, 0],
				opacity: [1, 1, 0, 0, 1],
				transition: {
					duration: 1.4 * duration,
					ease: "easeInOut",
					times: [0, 0.2, 0.4, 0.6, 1],
				},
			},
		};

		return (
			<LazyMotion features={domMin} strict>
				<m.div
					className={cn("inline-flex items-center justify-center", className)}
					onMouseEnter={handleEnter}
					onMouseLeave={handleLeave}
					{...props}
					style={{ color, ...props.style }}
				>
					<m.svg
						animate={controls}
						aria-hidden="true"
						fill="none"
						height={size}
						initial="normal"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
						variants={svgVariants}
						viewBox="0 0 24 24"
						width={size}
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M21.0477 3.05293C18.8697 0.707363 2.48648 6.4532 2.50001 8.551C2.51535 10.9299 8.89809 11.6617 10.6672 12.1581C11.7311 12.4565 12.016 12.7625 12.2613 13.8781C13.3723 18.9305 13.9301 21.4435 15.2014 21.4996C17.2278 21.5892 23.1733 5.342 21.0477 3.05293Z" />
						<path d="M11.4999 12.5L14.9999 9" />
					</m.svg>
				</m.div>
			</LazyMotion>
		);
	},
);

SendIcon.displayName = "SendIcon";

export { SendIcon };
