"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface AudioWave01IconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface AudioWave01IconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number;
}

const LINE_VARIANTS: Variants = {
	normal: { scaleY: 1 },
	animate: (custom: number) => ({
		scaleY: [1, 1.5, 0.5, 1],
		transition: {
			duration: 0.8,
			repeat: Number.POSITIVE_INFINITY,
			repeatType: "reverse",
			ease: "easeInOut",
			delay: custom * 0.1,
		},
	}),
};

const AudioWave01Icon = forwardRef<AudioWave01IconHandle, AudioWave01IconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
		const controls = useAnimation();
		const isControlledRef = useRef(false);

		useImperativeHandle(ref, () => {
			isControlledRef.current = true;

			return {
				startAnimation: () => controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			};
		});

		const handleMouseEnter = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (isControlledRef.current) {
					onMouseEnter?.(e);
				} else {
					controls.start("animate");
				}
			},
			[controls, onMouseEnter],
		);

		const handleMouseLeave = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (isControlledRef.current) {
					onMouseLeave?.(e);
				} else {
					controls.start("normal");
				}
			},
			[controls, onMouseLeave],
		);

		return (
			// biome-ignore lint/a11y/noStaticElementInteractions: decorative icon
			<div
				className={cn("inline-flex items-center justify-center", className)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				{...props}
			>
				<svg
					aria-hidden="true"
					fill="none"
					height={size}
					role="presentation"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
					viewBox="0 0 24 24"
					width={size}
					xmlns="http://www.w3.org/2000/svg"
				>
					<motion.path
						animate={controls}
						custom={0}
						d="M9 3V21"
						initial="normal"
						style={{ transformOrigin: "50% 50%" }}
						variants={LINE_VARIANTS}
					/>
					<motion.path
						animate={controls}
						custom={1}
						d="M6 7V17"
						initial="normal"
						style={{ transformOrigin: "50% 50%" }}
						variants={LINE_VARIANTS}
					/>
					<motion.path
						animate={controls}
						custom={2}
						d="M12 6V18"
						initial="normal"
						style={{ transformOrigin: "50% 50%" }}
						variants={LINE_VARIANTS}
					/>
					<motion.path
						animate={controls}
						custom={3}
						d="M15 9L15 15"
						initial="normal"
						style={{ transformOrigin: "50% 50%" }}
						variants={LINE_VARIANTS}
					/>
					<motion.path
						animate={controls}
						custom={4}
						d="M18 7L18 17"
						initial="normal"
						style={{ transformOrigin: "50% 50%" }}
						variants={LINE_VARIANTS}
					/>
					<motion.path
						animate={controls}
						custom={5}
						d="M21 11L21 13"
						initial="normal"
						style={{ transformOrigin: "50% 50%" }}
						variants={LINE_VARIANTS}
					/>
					<motion.path
						animate={controls}
						custom={6}
						d="M3 11L3 13"
						initial="normal"
						style={{ transformOrigin: "50% 50%" }}
						variants={LINE_VARIANTS}
					/>
				</svg>
			</div>
		);
	},
);

AudioWave01Icon.displayName = "AudioWave01Icon";

export { AudioWave01Icon };
