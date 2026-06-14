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
	useCallback,
	useImperativeHandle,
	useRef,
} from "react";
import { cn } from "@/lib/utils";
export interface BellRingIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface BellRingIconProps
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

const BellRingIcon = forwardRef<BellRingIconHandle, BellRingIconProps>(
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
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isAnimated || reduced) return;
				if (!isControlled.current) controls.start("animate");
				else onMouseEnter?.(e as unknown as React.MouseEvent<HTMLDivElement>);
			},
			[controls, reduced, isAnimated, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					controls.start("normal");
				} else {
					onMouseLeave?.(e as unknown as React.MouseEvent<HTMLDivElement>);
				}
			},
			[controls, onMouseLeave],
		);

		const bellVariants: Variants = {
			normal: { rotate: 0 },
			animate: {
				rotate: [0, -15, 13, -9, 6, -3, 0],
				transition: { duration: 1.4 * duration, ease: "easeInOut", repeat: 0 },
			},
		};

		const clapperVariants: Variants = {
			normal: { x: 0 },
			animate: {
				x: [0, -3, 3, -2, 2, 0],
				transition: { duration: 1.4 * duration, ease: "easeInOut", repeat: 0 },
			},
		};

		return (
			<LazyMotion features={domMin} strict>
				{}
				<m.div
					className={cn("relative inline-flex", className)}
					onMouseEnter={handleEnter}
					onMouseLeave={handleLeave}
					{...props}
					style={{ color, ...props.style }}
				>
					<m.svg
						animate={controls}
						fill="none"
						height={size}
						initial="normal"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
						variants={bellVariants}
						viewBox="0 0 24 24"
						width={size}
						xmlns="http://www.w3.org/2000/svg"
					>
						<m.path
							d="M16 18C16 20.2091 14.2091 22 12 22C9.79086 22 8 20.2091 8 18"
							variants={clapperVariants}
						/>
						<path d="M4.43654 18H19.5625C20.2903 18 20.6542 18 20.8648 17.8951C21.274 17.6913 21.4929 17.2359 21.3964 16.789C21.3468 16.559 21.1194 16.2749 20.6648 15.7066L20.4951 15.4944C20.0392 14.9246 19.8113 14.6397 19.6184 14.3409C19.0187 13.4119 18.6477 12.354 18.5356 11.254C18.4995 10.9002 18.4995 10.5353 18.4995 9.8056V8.5C18.4995 8.03572 18.4995 7.80358 18.4867 7.60758C18.2898 4.60304 15.8965 2.20977 12.892 2.01285C12.696 2 12.4638 2 11.9995 2C11.5353 2 11.3031 2 11.1071 2.01285C8.10258 2.20977 5.70931 4.60304 5.51239 7.60758C5.49954 7.80358 5.49954 8.03572 5.49954 8.5V9.8056C5.49954 10.5353 5.49954 10.9002 5.46349 11.254C5.35143 12.354 4.98035 13.4119 4.38067 14.3409C4.18779 14.6397 3.95985 14.9246 3.50401 15.4944L3.33427 15.7066C2.87964 16.2749 2.65233 16.559 2.60268 16.789C2.50621 17.2359 2.72509 17.6913 3.13431 17.8951C3.3449 18 3.70878 18 4.43654 18Z" />
					</m.svg>
				</m.div>
			</LazyMotion>
		);
	},
);

BellRingIcon.displayName = "BellRingIcon";

export { BellRingIcon };
