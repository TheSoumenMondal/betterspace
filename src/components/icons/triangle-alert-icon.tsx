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

export interface TriangleAlertIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface TriangleAlertIconProps
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

const TriangleAlertIcon = forwardRef<
	TriangleAlertIconHandle,
	TriangleAlertIconProps
>(
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
				if (!isControlled.current) {
					controls.start("animate");
				} else {
					onMouseEnter?.(e as MouseEvent<HTMLDivElement>);
				}
			},
			[controls, reduced, isAnimated, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					controls.start("normal");
				} else {
					onMouseLeave?.(e as MouseEvent<HTMLDivElement>);
				}
			},
			[controls, onMouseLeave],
		);

		const svgVariants: Variants = {
			normal: { x: 0, scale: 1 },
			animate: {
				x: [0, -2, 2, -2, 2, 0],
				scale: [1, 1.08, 1],
				transition: {
					duration: 0.45 * duration,
					ease: "easeInOut",
				},
			},
		};

		const triangleVariants: Variants = {
			normal: { opacity: 1 },
			animate: {
				opacity: [0.5, 1],
				transition: {
					duration: 0.6 * duration,
					ease: "easeOut",
				},
			},
		};

		const lineVariants: Variants = {
			normal: { scaleY: 1, opacity: 1 },
			animate: {
				scaleY: [0.4, 1.3, 1],
				opacity: [0.4, 1],
				transition: {
					duration: 0.35 * duration,
					ease: "easeOut",
					delay: 0.15 * duration,
				},
			},
		};

		const dotVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [0.3, 1.6, 1],
				opacity: [0.3, 1],
				transition: {
					duration: 0.3 * duration,
					ease: "easeOut",
					delay: 0.25 * duration,
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
						<m.path
							d="M13.9248 21H10.0752C5.44476 21 3.12955 21 2.27636 19.4939C1.42317 17.9879 2.60736 15.9914 4.97574 11.9985L6.90057 8.75333C9.17559 4.91778 10.3131 3 12 3C13.6869 3 14.8244 4.91777 17.0994 8.75332L19.0243 11.9985C21.3926 15.9914 22.5768 17.9879 21.7236 19.4939C20.8704 21 18.5552 21 13.9248 21Z"
							variants={triangleVariants}
						/>
						<m.path
							d="M12 17V13"
							style={{ originY: 1 }}
							variants={lineVariants}
						/>
						<m.path
							d="M12 9.25H12.125M12.25 9.25C12.25 9.11193 12.1381 9 12 9C11.8619 9 11.75 9.11193 11.75 9.25C11.75 9.38807 11.8619 9.5 12 9.5C12.1381 9.5 12.25 9.38807 12.25 9.25Z"
							variants={dotVariants}
						/>
					</m.svg>
				</m.div>
			</LazyMotion>
		);
	},
);

TriangleAlertIcon.displayName = "TriangleAlertIcon";

export { TriangleAlertIcon };
