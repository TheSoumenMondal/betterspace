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
	useMemo,
	useRef,
} from "react";
import { cn } from "@/lib/utils";

export interface BrainIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface BrainIconProps
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

const BrainIcon = forwardRef<BrainIconHandle, BrainIconProps>(
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
		const groupControls = useAnimation();
		const pulseControls = useAnimation();
		const sparkControlsL = useAnimation();
		const sparkControlsR = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						groupControls.start("normal");
						pulseControls.start("normal");
						sparkControlsL.start("normal");
						sparkControlsR.start("normal");
					} else {
						groupControls.start("animate");
						pulseControls.start("animate");
						sparkControlsL.start("animate");
						sparkControlsR.start("animate");
					}
				},
				stopAnimation: () => {
					groupControls.start("normal");
					pulseControls.start("normal");
					sparkControlsL.start("normal");
					sparkControlsR.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: MouseEvent<HTMLDivElement>) => {
				if (!isAnimated || reduced) return;
				if (!isControlled.current) {
					groupControls.start("animate");
					pulseControls.start("animate");
					sparkControlsL.start("animate");
					sparkControlsR.start("animate");
				} else {
					onMouseEnter?.(e as MouseEvent<HTMLDivElement>);
				}
			},
			[
				groupControls,
				pulseControls,
				sparkControlsL,
				sparkControlsR,
				reduced,
				onMouseEnter,
				isAnimated,
			],
		);

		const handleLeave = useCallback(
			(e?: MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					groupControls.start("normal");
					pulseControls.start("normal");
					sparkControlsL.start("normal");
					sparkControlsR.start("normal");
				} else {
					onMouseLeave?.(e as MouseEvent<HTMLDivElement>);
				}
			},
			[
				groupControls,
				pulseControls,
				sparkControlsL,
				sparkControlsR,
				onMouseLeave,
			],
		);

		// Whole-icon micro-tilt on trigger
		const microTilt: Variants = useMemo(
			() => ({
				normal: { rotate: 0, scale: 1 },
				animate: {
					rotate: [0, -2.2, 1.2, 0],
					scale: [1, 1.015, 1],
					transition: { duration: 0.7 * duration, ease: "easeInOut" },
				},
			}),
			[duration],
		);

		// Spine / corpus-callosum pulse — draws in from left
		const spinePulse: Variants = useMemo(
			() => ({
				normal: { pathLength: 1, opacity: 1 },
				animate: {
					pathLength: [0, 1],
					opacity: [0.45, 1],
					transition: {
						duration: 0.52 * duration,
						ease: "easeInOut",
						delay: 0.06,
					},
				},
			}),
			[duration],
		);

		// Left lobe breathes in
		const lobeBreatheA: Variants = useMemo(
			() => ({
				normal: { pathLength: 1, opacity: 1, scale: 1 },
				animate: {
					pathLength: [0, 1],
					opacity: [0.6, 1],
					scale: [0.98, 1.02, 1],
					transition: {
						duration: 0.6 * duration,
						ease: "easeInOut",
						delay: 0.12,
					},
				},
			}),
			[duration],
		);

		// Right lobe breathes in (mirrored phase)
		const lobeBreatheB: Variants = useMemo(
			() => ({
				normal: { pathLength: 1, opacity: 1, scale: 1 },
				animate: {
					pathLength: [0, 1],
					opacity: [0.6, 1],
					scale: [1.02, 0.98, 1],
					transition: {
						duration: 0.62 * duration,
						ease: "easeInOut",
						delay: 0.18,
					},
				},
			}),
			[duration],
		);

		// Left synapse spark (AZ letter-like path)
		const _synapseSparkL: Variants = useMemo(
			() => ({
				normal: { pathLength: 0, opacity: 0 },
				animate: {
					pathLength: [0, 1],
					opacity: [0, 1, 0],
					transition: {
						duration: 0.55 * duration,
						ease: "easeInOut",
						delay: 0.26,
					},
				},
			}),
			[duration],
		);

		// Right synapse spark (vertical bar)
		const _synapseSparkR: Variants = useMemo(
			() => ({
				normal: { pathLength: 0, opacity: 0 },
				animate: {
					pathLength: [0, 1],
					opacity: [0, 1, 0],
					transition: {
						duration: 0.55 * duration,
						ease: "easeInOut",
						delay: 0.34,
					},
				},
			}),
			[duration],
		);

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
						className="lucide lucide-brain-icon lucide-brain"
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
						<m.g animate={groupControls} initial="normal" variants={microTilt}>
							{/* Outer lobe shape — left breathe */}
							<m.path
								animate={pulseControls}
								d="M4 16.4999C4 18.1567 5.34315 19.4999 7 19.4999C7 20.8806 8.11929 21.9999 9.5 21.9999C10.8807 21.9999 12 20.8806 12 19.4999C12 20.8806 13.1193 21.9998 14.5 21.9998C15.8807 21.9998 17 20.8805 17 19.4998C18.6569 19.4998 20 18.1566 20 16.4998C20 15.9311 19.8418 15.3994 19.567 14.9463C20.9527 14.6812 22 13.4628 22 11.9998C22 10.5367 20.9527 9.31831 19.567 9.05325C19.8418 8.60012 20 8.06842 20 7.49976C20 5.8429 18.6569 4.49976 17 4.49976C17 3.11904 15.8807 1.99976 14.5 1.99976C13.1193 1.99976 12 3.11914 12 4.49985C12 3.11914 10.8807 1.99985 9.5 1.99985C8.11929 1.99985 7 3.11914 7 4.49985C5.34315 4.49985 4 5.843 4 7.49985C4 8.06851 4.15822 8.60022 4.43304 9.05335C3.04727 9.3184 2 10.5368 2 11.9999C2 13.4629 3.04727 14.6813 4.43304 14.9464C4.15822 15.3995 4 15.9312 4 16.4999Z"
								initial="normal"
								variants={lobeBreatheA}
							/>
							{/* Spine / corpus callosum */}
							<m.path
								animate={pulseControls}
								d="M12 4.5V19.5"
								initial="normal"
								strokeOpacity={0.35}
								variants={spinePulse}
							/>
							{/* Left lobe inner detail */}
							<m.path
								animate={pulseControls}
								d="M7 11.5C7 11.5 7.5 10 9 10C10.5 10 11 11.5 11 11.5"
								initial="normal"
								strokeOpacity={0.5}
								variants={lobeBreatheB}
							/>
							{/* Right lobe inner detail */}
							<m.path
								animate={pulseControls}
								d="M13 14C13 14 13.5 12.5 15 12.5C16.5 12.5 17 14 17 14"
								initial="normal"
								strokeOpacity={0.5}
								variants={lobeBreatheA}
							/>
							{/* Left synapse spark — AZ-style path */}
							<m.path d="M7.5 14.4999L9.34189 8.97422C9.43631 8.69095 9.7014 8.49988 10 8.49988C10.2986 8.49988 10.5637 8.69095 10.6581 8.97422L12.5 14.4999M8.5 12.4999H11.5" />
							{/* Right synapse spark — vertical bar */}
							<m.path d="M15.5 8.49988V14.4999" />
						</m.g>
					</m.svg>
				</m.div>
			</LazyMotion>
		);
	},
);

BrainIcon.displayName = "BrainIcon";

export { BrainIcon };
