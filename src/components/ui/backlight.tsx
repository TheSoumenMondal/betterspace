import { type ReactElement, useId } from "react";

type BacklightProps = {
	children?: ReactElement;
	className?: string;
	blur?: number;
};

export function Backlight({ blur = 20, children, className }: BacklightProps) {
	const id = useId().replace(/:/g, "");

	return (
		<div className={className}>
			<svg aria-hidden="true" className="absolute" height="0" width="0">
				<filter height="200%" id={id} width="200%" x="-50%" y="-50%">
					<feGaussianBlur
						in="SourceGraphic"
						result="blurred"
						stdDeviation={blur}
					></feGaussianBlur>
					<feColorMatrix
						in="blurred"
						type="saturate"
						values="4"
					></feColorMatrix>
					<feComposite in="SourceGraphic" operator="over"></feComposite>
				</filter>
			</svg>

			<div className="h-full w-full" style={{ filter: `url(#${id})` }}>
				{children}
			</div>
		</div>
	);
}
