import type { Metadata } from "next";
import { Footer, Navbar } from "@/components/features/landing";

export const metadata: Metadata = {
	title: "About Us | betterspace",
	description: "Learn more about betterspace and our mission.",
};

const AboutPage = () => {
	return (
		<div className="min-h-screen w-full bg-background font-sans antialiased">
			<Navbar />
			<main className="relative z-0 flex flex-col bg-black/10 dark:bg-white/10">
				<section className="overflow-hidden">
					<div className="relative">
						<div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr]">
							<div
								className="grid"
								style={{ gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }}
							>
								<div aria-hidden="true" className="w-full p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
							</div>
							<div className="mx-auto w-full max-w-276 lg:min-w-276">
								<div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-card">
									<div className="grid grid-cols-10 gap-[0.5px]">
										<div
											aria-hidden="true"
											className="col-span-1 max-sm:hidden"
										>
											<div data-grid-content="true"></div>
										</div>
										<div className="col-span-full sm:col-span-8">
											<div
												className="px-6 py-16 text-left md:py-32"
												data-grid-content="true"
											>
												<div className="mx-auto max-w-3xl">
													<h1 className="mb-8 font-copper-bt-regular font-semibold text-4xl text-foreground tracking-tight lg:text-5xl">
														About BetterSpace
													</h1>
													<div className="space-y-8 font-geist-sans text-muted-foreground leading-relaxed">
														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																Our Mission
															</h2>
															<p>
																At BetterSpace, our mission is to eliminate the
																busywork from your daily routine. We believe
																that managing your calendar and inbox shouldn't
																be a full-time job. By connecting intelligent AI
																directly to your Google Workspace, we empower
																you to focus on the deep work that actually
																matters.
															</p>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																What We Do
															</h2>
															<p>
																We build cutting-edge, autonomous agents that
																live in your Gmail and Google Calendar. From
																automatically scheduling meetings across
																different time zones to drafting context-aware
																email replies, BetterSpace acts as your tireless
																digital chief of staff.
															</p>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																The Technology
															</h2>
															<p>
																Built on top of robust frameworks like Next.js,
																PostgreSQL, and advanced LLM integrations,
																BetterSpace ensures your data is processed
																securely and rapidly. We leverage the
																corsair.dev framework for seamless AI
																operations, allowing our agents to reason and
																act with unparalleled reliability.
															</p>
														</section>

														<section className="space-y-4 pt-8">
															<p className="font-medium text-sm">
																Ready to take back your time?{" "}
																<a
																	className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
																	href="/auth/login"
																>
																	Get started today
																</a>
																.
															</p>
														</section>
													</div>
												</div>
											</div>
										</div>
										<div
											aria-hidden="true"
											className="col-span-1 max-sm:hidden"
										>
											<div data-grid-content="true"></div>
										</div>
									</div>
								</div>
							</div>
							<div
								className="grid"
								style={{ gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }}
							>
								<div aria-hidden="true" className="p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default AboutPage;
