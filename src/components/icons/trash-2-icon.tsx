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

export interface Trash2IconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface Trash2IconProps
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

const Trash2Icon = forwardRef<Trash2IconHandle, Trash2IconProps>(
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
		const binControls = useAnimation();
		const lidControls = useAnimation();
		const barControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						binControls.start("normal");
						lidControls.start("normal");
						barControls.start("normal");
					} else {
						binControls.start("animate");
						lidControls.start("animate");
						barControls.start("animate");
					}
				},
				stopAnimation: () => {
					binControls.start("normal");
					lidControls.start("normal");
					barControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: MouseEvent<HTMLDivElement>) => {
				if (!isAnimated || reduced) return;
				if (!isControlled.current) {
					binControls.start("animate");
					lidControls.start("animate");
					barControls.start("animate");
				} else {
					onMouseEnter?.(e as MouseEvent<HTMLDivElement>);
				}
			},
			[
				binControls,
				lidControls,
				barControls,
				reduced,
				onMouseEnter,
				isAnimated,
			],
		);

		const handleLeave = useCallback(
			(e?: MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					binControls.start("normal");
					lidControls.start("normal");
					barControls.start("normal");
				} else {
					onMouseLeave?.(e as MouseEvent<HTMLDivElement>);
				}
			},
			[binControls, lidControls, barControls, onMouseLeave],
		);

		const binVariants: Variants = {
			normal: { scale: 1, rotate: 0, y: 0 },
			animate: {
				scale: [1, 1.05, 0.97, 1],
				rotate: [0, -2, 2, 0],
				y: [0, -1.5, 0],
				transition: { duration: 0.8 * duration, ease: "easeInOut" },
			},
		};

		const lidVariants: Variants = {
			normal: { rotate: 0, y: 0, transformOrigin: "12px 4px" },
			animate: {
				rotate: [-15, 5, 0],
				y: [-2, 0],
				transition: { duration: 0.7 * duration, ease: "easeOut", delay: 0.1 },
			},
		};

		const barVariants: Variants = {
			normal: { scaleY: 1, opacity: 1, transformOrigin: "center bottom" },
			animate: {
				scaleY: [1, 1.2, 1],
				opacity: [1, 0.9, 1],
				transition: { duration: 0.6 * duration, ease: "easeInOut", delay: 0.2 },
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
						aria-hidden="true"
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
						<m.path
							animate={binControls}
							d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
							initial="normal"
							variants={binVariants}
						/>
						<m.path
							animate={lidControls}
							d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
							initial="normal"
							variants={lidVariants}
						/>
						<m.path
							animate={barControls}
							d="M9.5 16.5V10.5M14.5 16.5V10.5"
							initial="normal"
							variants={barVariants}
						/>
					</m.svg>
				</m.div>
			</LazyMotion>
		);
	},
);

Trash2Icon.displayName = "Trash2Icon";

export { Trash2Icon };
