import type { SVGProps } from "react";

export function Menu02Icon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			aria-label="Menu"
			color="currentColor"
			fill="none"
			height="24"
			role="img"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M3 5H21"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
			<path
				d="M3 12H21"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
			<path
				d="M3 19H21"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
}
