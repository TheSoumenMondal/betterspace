import { TextHoverEffect } from "@/components/ui/text-hover-effect";
export const Footer = () => {
	return (
		<footer>
			<div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr]">
				<div
					className="grid"
					style={{ gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }}
				>
					<div aria-hidden="true" className="w-full p-[0.5px]">
						<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full" />
					</div>
				</div>
				<div className="mx-auto w-full max-w-276 p-[0.5px] lg:min-w-276">
					<div className="rounded bg-card">
						<div className="h-40 w-full lg:h-52">
							<TextHoverEffect duration={0.3} text="BETTERSPACE" />
						</div>
					</div>
				</div>
				<div
					className="grid"
					style={{ gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }}
				>
					<div aria-hidden="true" className="p-[0.5px]">
						<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full" />
					</div>
				</div>
			</div>
		</footer>
	);
};
