import Link from "next/link";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export const Footer = () => {
	return (
		<footer>
			<div className="@container grid grid-cols-[auto_1fr_auto] bg-black/10 lg:grid-cols-[1fr_auto_1fr] dark:bg-white/10">
				{/* Top Row: BETTERSPACE */}
				<div
					className="grid"
					style={{ gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }}
				>
					<div aria-hidden="true" className="w-full p-[0.5px]">
						<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full" />
					</div>
				</div>
				<div className="mx-auto w-full max-w-276 p-[0.5px] lg:min-w-276">
					<div className="h-full rounded bg-card">
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

				{/* Bottom Row: Links */}
				<div
					className="grid"
					style={{ gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }}
				>
					<div aria-hidden="true" className="w-full p-[0.5px]">
						<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full" />
					</div>
				</div>
				<div className="mx-auto w-full max-w-276 p-[0.5px] lg:min-w-276">
					<div className="flex h-full flex-col items-center justify-center gap-4 rounded bg-card px-4 py-8 text-muted-foreground text-sm md:flex-row md:gap-8">
						<div className="flex items-center gap-6">
							<Link
								className="transition-colors hover:text-foreground"
								href="/privacy"
							>
								Privacy Policy
							</Link>
							<Link
								className="transition-colors hover:text-foreground"
								href="/terms"
							>
								Terms of Service
							</Link>
						</div>
						<p>
							© {new Date().getFullYear()} betterspace. All rights reserved.
						</p>
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
