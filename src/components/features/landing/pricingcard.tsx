"use client";
import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import NumberFlow from "@number-flow/react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { PLANS } from "@/lib/plans";

const FEATURE_LABELS = [
	{
		key: "accounts",
		label: (plan: (typeof PLANS)[keyof typeof PLANS]) =>
			`${plan.maxConnectedAccounts} Connected Account${plan.maxConnectedAccounts > 1 ? "s" : ""}`,
		enabled: () => true,
	},
	{
		key: "emails",
		label: (plan: (typeof PLANS)[keyof typeof PLANS]) =>
			`At most ${plan.maxEmails.toLocaleString()} emails / month synchronization`,
		enabled: () => true,
	},
	{
		key: "ai",
		label: (plan: (typeof PLANS)[keyof typeof PLANS]) =>
			`${plan.aiMessagesPerMonth} AI Messages / month`,
		enabled: () => true,
	},
	{
		key: "aiInsights",
		label: () => "AI insights & summaries on synced mail",
		enabled: () => true,
	},
	{
		key: "realtimeSync",
		label: () => "Real-time Inbox Sync",
		enabled: (plan: (typeof PLANS)[keyof typeof PLANS]) => plan.realtimeSync,
	},
	{
		key: "meetingScheduling",
		label: () => "Automated Meeting Scheduling",
		enabled: (plan: (typeof PLANS)[keyof typeof PLANS]) =>
			plan.meetingScheduling,
	},
	{
		key: "followUps",
		label: () => "Smart Follow-ups",
		enabled: (plan: (typeof PLANS)[keyof typeof PLANS]) => plan.followUps,
	},
	{
		key: "advancedSearch",
		label: () => "Advanced Search (⌘K)",
		enabled: (plan: (typeof PLANS)[keyof typeof PLANS]) => plan.advancedSearch,
	},
	{
		key: "webhooks",
		label: () => "Webhooks",
		enabled: (plan: (typeof PLANS)[keyof typeof PLANS]) => plan.webhooks,
	},
	{
		key: "prioritySupport",
		label: () => "Priority Support",
		enabled: (plan: (typeof PLANS)[keyof typeof PLANS]) => plan.prioritySupport,
	},
	{
		key: "advancedAutomations",
		label: () => "Advanced Automations",
		enabled: (plan: (typeof PLANS)[keyof typeof PLANS]) =>
			plan.advancedAutomations,
	},
];
export const PricingCard = () => {
	const plans = Object.entries(PLANS);
	return (
		<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
			{plans.map(([key, plan], index) => {
				const isPro = index === 1;
				const isFree = plan.price.monthly.inrAmount === 0;
				const features = FEATURE_LABELS.map((f) => ({
					label: f.label(plan),
					enabled: f.enabled(plan),
				}));
				return (
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className={`relative flex flex-col rounded-2xl border p-6 ${
							isPro
								? "border-foreground bg-foreground shadow-xl"
								: "border-border bg-card"
						}`}
						initial={{ opacity: 0, y: 24 }}
						key={key}
						transition={{
							delay: index * 0.1,
							duration: 0.4,
							ease: [0.32, 0.72, 0, 1],
						}}
					>
						{isPro && (
							<div className="absolute -top-3 left-1/2 -translate-x-1/2">
								<span className="whitespace-nowrap rounded-full bg-primary px-4 py-1 font-semibold text-primary-foreground text-xs shadow-sm">
									Most Popular
								</span>
							</div>
						)}
						<div className="mb-5">
							<h3
								className={`font-semibold text-lg ${
									isPro ? "text-background" : "text-foreground"
								}`}
							>
								{plan.name}
							</h3>
							<p
								className={`mt-1 text-sm ${
									isPro ? "text-background/60" : "text-muted-foreground"
								}`}
							>
								{plan.description}
							</p>
						</div>
						<div className="mb-6">
							<div className="flex items-baseline gap-1">
								{!isFree && (
									<span
										className={`font-medium text-lg ${
											isPro ? "text-background/70" : "text-muted-foreground"
										}`}
									>
										₹
									</span>
								)}
								<NumberFlow
									className={`font-bold text-4xl tabular-nums ${
										isPro ? "text-background" : "text-foreground"
									}`}
									value={plan.price.monthly.inrAmount}
								/>
							</div>
							<p
								className={`mt-1 text-xs ${
									isPro ? "text-background/50" : "text-muted-foreground/60"
								}`}
							>
								{isFree ? "forever free" : "per month"}
							</p>
						</div>
						{isFree ? (
							<a
								className={`mb-6 inline-flex h-10 w-full items-center justify-center rounded-xl font-semibold text-sm transition-all duration-200 ${
									isPro
										? "bg-background text-foreground hover:bg-background/90"
										: "border border-foreground/15 bg-transparent text-foreground hover:bg-muted/60"
								}`}
								href="/auth/login"
							>
								Get Started Free
							</a>
						) : (
							<button
								className={`mb-6 inline-flex h-10 w-full items-center justify-center rounded-xl font-semibold text-sm transition-all duration-200 ${
									isPro
										? "bg-background text-foreground hover:bg-background/90"
										: "border border-foreground/15 bg-transparent text-foreground hover:bg-muted/60"
								}`}
								onClick={(e) => {
									e.preventDefault();
									toast.info("This app is currently in development phase.", {
										description:
											"To access all features, please get admin approval.",
									});
								}}
								type="button"
							>
								Upgrade to {plan.name}
							</button>
						)}
						<div
							className={`mb-5 h-px ${isPro ? "bg-background/15" : "bg-border"}`}
						/>
						<div className="flex flex-1 flex-col gap-3">
							<p
								className={`font-semibold text-[11px] uppercase tracking-widest ${
									isPro ? "text-background/40" : "text-muted-foreground/60"
								}`}
							>
								What's included
							</p>
							{features.map((feature, fi) => (
								<motion.div
									animate={{ opacity: 1, x: 0 }}
									className="flex items-start gap-2.5 text-sm"
									initial={{ opacity: 0, x: -4 }}
									key={feature.label}
									transition={{
										delay: index * 0.1 + fi * 0.03,
										duration: 0.25,
									}}
								>
									{feature.enabled ? (
										<HugeiconsIcon
											className={`mt-0.5 shrink-0 ${isPro ? "text-background" : "text-emerald-500"}`}
											icon={Tick02Icon}
											size={15}
										/>
									) : (
										<HugeiconsIcon
											className="mt-0.5 shrink-0 text-muted-foreground/30"
											icon={Cancel01Icon}
											size={15}
										/>
									)}
									<span
										className={
											feature.enabled
												? isPro
													? "text-background/80"
													: "text-foreground/75"
												: "text-muted-foreground/35"
										}
									>
										{feature.label}
									</span>
								</motion.div>
							))}
						</div>
					</motion.div>
				);
			})}
		</div>
	);
};
