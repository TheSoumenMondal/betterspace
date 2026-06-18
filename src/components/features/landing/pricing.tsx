import { PricingCard } from "./pricingcard";
export const Pricing = () => {
	return (
		<section id="pricing">
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
					<div className="h-full rounded bg-card py-16 lg:py-24">
						<div className="mx-auto max-w-2xl space-y-4 px-6 text-center">
							<h2 className="text-balance font-copper-bt-regular font-semibold text-4xl text-foreground lg:text-5xl">
								Simple, transparent pricing
							</h2>
							<p className="text-balance font-geist-sans text-lg text-muted-foreground">
								Choose the plan that fits your workflow. Start for free and
								scale as you grow.
							</p>
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
					<div className="rounded bg-card px-6 py-12 lg:px-12 lg:py-20">
						<PricingCard />
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
					<div className="h-16 rounded bg-card lg:h-24" />
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
		</section>
	);
};
