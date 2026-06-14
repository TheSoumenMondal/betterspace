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

export interface UserCircleIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface UserCircleIconProps
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

const UserCircleIcon = forwardRef<UserCircleIconHandle, UserCircleIconProps>(
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

		const headVariants: Variants = {
			normal: { y: 0, scale: 1, rotate: 0 },
			animate: {
				y: [-1, -2, 0],
				scale: [1, 1.1, 1],
				rotate: [-10, 10, -5, 0],
				transition: { duration: 0.6 * duration, ease: "easeInOut" },
			},
		};

		const bodyVariants: Variants = {
			normal: { y: 0, scale: 1 },
			animate: {
				y: [2, -1, 0],
				scale: [1, 1.05, 1],
				transition: { duration: 0.6 * duration, ease: "easeInOut" },
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
						<m.path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" />
						<m.path
							animate={controls}
							d="M15.5 10.5C15.5 8.567 13.933 7 12 7C10.067 7 8.5 8.567 8.5 10.5C8.5 12.433 10.067 14 12 14C13.933 14 15.5 12.433 15.5 10.5Z"
							initial="normal"
							style={{ transformOrigin: "12px 10.5px" }}
							variants={headVariants}
						/>
						<m.path
							animate={controls}
							d="M18 20C18 16.6863 15.3137 14 12 14C8.68629 14 6 16.6863 6 20"
							initial="normal"
							variants={bodyVariants}
						/>
					</m.svg>
				</m.div>
			</LazyMotion>
		);
	},
);

UserCircleIcon.displayName = "UserCircleIcon";

export { UserCircleIcon };
