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
export interface MailIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface MailIconProps
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

const MailIcon = forwardRef<MailIconHandle, MailIconProps>(
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
		const flapControls = useAnimation();
		const bodyControls = useAnimation();
		const containerControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						containerControls.start("normal");
						flapControls.start("normal");
						bodyControls.start("normal");
					} else {
						containerControls.start("animate");
						flapControls.start("animate");
						bodyControls.start("animate");
					}
				},
				stopAnimation: () => {
					containerControls.start("normal");
					flapControls.start("normal");
					bodyControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isAnimated || reduced) return;
				if (!isControlled.current) {
					containerControls.start("animate");
					flapControls.start("animate");
					bodyControls.start("animate");
				} else onMouseEnter?.(e as unknown as React.MouseEvent<HTMLDivElement>);
			},
			[
				containerControls,
				flapControls,
				bodyControls,
				reduced,
				onMouseEnter,
				isAnimated,
			],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					containerControls.start("normal");
					flapControls.start("normal");
					bodyControls.start("normal");
				} else onMouseLeave?.(e as unknown as React.MouseEvent<HTMLDivElement>);
			},
			[containerControls, flapControls, bodyControls, onMouseLeave],
		);

		const containerVariants: Variants = {
			normal: { scale: 1 },
			animate: {
				scale: [1, 1.04, 1],
				transition: { duration: 0.36 * duration, ease: "easeOut" },
			},
		};

		const flapVariants: Variants = {
			normal: { rotateX: 0, translateY: 0, transformOrigin: "12px 6px" },
			animate: {
				rotateX: [-0, -12, 2, 0],
				translateY: [0, -1.6, 0.6, 0],
				transition: {
					duration: 0.45 * duration,
					ease: "easeOut",
					times: [0, 0.5, 0.85, 1],
				},
			},
		};

		const bodyVariants: Variants = {
			normal: { opacity: 1 },
			animate: {
				opacity: [1, 0.95, 1],
				transition: { duration: 0.45 * duration, ease: "easeOut" },
			},
		};

		return (
			<LazyMotion features={domMin} strict>
				{}
				<m.div
					className={cn("inline-flex items-center justify-center", className)}
					onMouseEnter={handleEnter}
					onMouseLeave={handleLeave}
					{...props}
					animate={containerControls}
					initial="normal"
					style={{ color, ...props.style }}
					variants={containerVariants}
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
						<m.path
							animate={flapControls}
							d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6"
							initial="normal"
							style={{ transformStyle: "preserve-3d", transformOrigin: "top" }}
							variants={flapVariants}
						/>
						<m.path
							animate={bodyControls}
							d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
							initial="normal"
							variants={bodyVariants}
						/>
					</svg>
				</m.div>
			</LazyMotion>
		);
	},
);

MailIcon.displayName = "MailIcon";

export { MailIcon };
