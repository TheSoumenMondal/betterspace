"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface LicenseDraftIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface LicenseDraftIconProps extends HTMLAttributes<HTMLDivElement> {
	size?: number;
}

const PEN_VARIANTS: Variants = {
	normal: {
		rotate: 0,
		x: 0,
		y: 0,
	},
	animate: {
		rotate: [-5, 5, -5, 0],
		x: [0, -1, 1, 0],
		y: [0, 1, -1, 0],
		transition: {
			duration: 0.5,
			ease: "easeInOut",
		},
	},
};

const LINES_VARIANTS: Variants = {
	normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
	animate: {
		pathLength: [0, 1],
		opacity: [0, 1],
		transition: {
			duration: 0.5,
			ease: "easeOut",
		},
	},
};

const LicenseDraftIcon = forwardRef<
	LicenseDraftIconHandle,
	LicenseDraftIconProps
>(({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
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
				<path d="M19.7502 11V10C19.7502 6.22876 19.7502 4.34315 18.5786 3.17157C17.407 2 15.5214 2 11.7502 2H10.7503C6.97907 2 5.09347 2 3.9219 3.17156C2.75033 4.34312 2.75031 6.22872 2.75028 9.99993L2.75024 14C2.75021 17.7712 2.7502 19.6568 3.92173 20.8284C5.0933 21.9999 6.97898 22 10.7502 22" />
				<motion.path
					animate={controls}
					d="M7.25024 7H15.2502M7.25024 12H15.2502"
					initial="normal"
					variants={LINES_VARIANTS}
				/>
				<motion.path
					animate={controls}
					d="M13.2502 20.8268V22H14.4236C14.833 22 15.0377 22 15.2217 21.9238C15.4058 21.8475 15.5505 21.7028 15.84 21.4134L20.6636 16.5894C20.9366 16.3164 21.0731 16.1799 21.1461 16.0327C21.285 15.7525 21.285 15.4236 21.1461 15.1434C21.0731 14.9961 20.9366 14.8596 20.6636 14.5866C20.3905 14.3136 20.254 14.1771 20.1067 14.1041C19.8265 13.9653 19.4975 13.9653 19.2173 14.1041C19.0701 14.1771 18.9335 14.3136 18.6605 14.5866L18.6605 14.5866L13.8369 19.4106C13.5475 19.7 13.4027 19.8447 13.3265 20.0287C13.2502 20.2128 13.2502 20.4174 13.2502 20.8268Z"
					initial="normal"
					style={{ originX: "18px", originY: "18px" }}
					variants={PEN_VARIANTS}
				/>
			</svg>
		</div>
	);
});

LicenseDraftIcon.displayName = "LicenseDraftIcon";

export { LicenseDraftIcon };
