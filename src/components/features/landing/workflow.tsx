export const Workflow = () => {
	return (
		<section
			className="[--color-primary:var(--color-indigo-500)]"
			id="workflow"
		>
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
					<div className="@5xl:grid grid @2xl:grid-cols-5 @5xl:grid-cols-10 *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-card">
						<div className="@max-5xl:row-start-2 @max-2xl:hidden">
							<div data-grid-content="true"></div>
						</div>
						<div className="@5xl:col-span-4 col-span-full">
							<div className="@2xl:p-12 p-6" data-grid-content="true">
								<div className="@5xl:sticky @5xl:top-32 @max-5xl:mx-auto @5xl:h-fit @5xl:max-w-xs max-w-xl text-balance @max-5xl:text-center">
									<h2 className="mb-6 font-copper-bt-regular font-semibold text-4xl text-foreground">
										Inbox Organization & Flow
									</h2>
									<p className="font-sans text-muted-foreground text-sm">
										BetterSpace automatically categorizes and prioritizes your
										Gmail inbox so you can focus on what matters most. Stop
										drowning in noise.
									</p>
								</div>
							</div>
						</div>
						<div className="@2xl:col-span-3 @5xl:col-span-4 grid gap-[0.5px]">
							<div
								className="grid @max-5xl:h-auto h-full grid-rows-[auto_1fr] gap-[0.5px]"
								data-slot="feature-card"
							>
								<div
									className="space-y-4 p-6 @4xl:px-12 @4xl:pt-12"
									data-grid-content="true"
									data-slot="feature-card-content"
								>
									<h3
										className="flex items-center gap-2 font-geist-mono font-semibold text-muted-foreground uppercase tracking-tight"
										data-slot="feature-card-title"
									>
										<span>01.</span> Triage
									</h3>
									<p
										className="text-balance font-medium text-muted-foreground text-xl"
										data-slot="feature-card-description"
									>
										<span className="text-foreground">
											Smart Categorization.
										</span>{" "}
										Automatically sort your emails into Priority, Read Later,
										and Noise, keeping your inbox clean.
									</p>
								</div>
								<div
									className="flex flex-col items-center justify-center @4xl:px-10 px-6 pt-6 @4xl:pb-12 pb-6"
									data-grid-content="true"
									data-slot="feature-card-illustration"
								>
									<div aria-hidden="true" className="w-full space-y-3">
										<div className="flex flex-col gap-2 rounded-md border bg-illustration p-4">
											<div className="flex items-center justify-between">
												<span className="inline-flex items-center gap-1.5 rounded-sm border border-dashed bg-blue-500/10 px-2 py-1 font-medium text-blue-500 text-xs">
													Priority
												</span>
												<span className="text-muted-foreground text-xs">
													10:42 AM
												</span>
											</div>
											<div>
												<div className="font-semibold text-foreground text-sm">
													Investor Update - Q3
												</div>
												<div className="text-muted-foreground text-xs">
													Sarah Jenkins
												</div>
											</div>
										</div>
										<div className="flex flex-col gap-2 rounded-md border p-4">
											<div className="flex items-center justify-between">
												<span className="inline-flex items-center gap-1.5 rounded-sm border border-dashed bg-purple-500/10 px-2 py-1 font-medium text-purple-500 text-xs">
													Newsletter
												</span>
												<span className="text-muted-foreground text-xs">
													Yesterday
												</span>
											</div>
											<div>
												<div className="font-semibold text-foreground text-sm">
													Weekly Tech Insights
												</div>
												<div className="text-muted-foreground text-xs">
													TechCrunch
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								className="grid @max-5xl:h-auto h-full grid-rows-[auto_1fr] gap-[0.5px]"
								data-slot="feature-card"
							>
								<div
									className="space-y-4 p-6 @4xl:px-12 @4xl:pt-12"
									data-grid-content="true"
									data-slot="feature-card-content"
								>
									<h3
										className="flex items-center gap-2 font-geist-mono font-semibold text-muted-foreground uppercase tracking-tight"
										data-slot="feature-card-title"
									>
										<span className="font-mono">02.</span> Understand
									</h3>
									<p
										className="text-balance font-medium text-muted-foreground text-xl"
										data-slot="feature-card-description"
									>
										<span className="text-foreground">AI Summaries.</span> Get
										the gist of long email threads instantly without reading
										every single message.
									</p>
								</div>
								<div
									className="relative flex flex-col items-center justify-center @4xl:px-12 px-6 pt-6 @4xl:pb-12 pb-6"
									data-grid-content="true"
									data-slot="feature-card-illustration"
								>
									<div aria-hidden="true" className="w-full">
										<div className="flex flex-col gap-3 rounded-md border bg-illustration p-4">
											<div className="flex items-center gap-3 border-border/50 border-b pb-3">
												<div className="flex size-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
													<svg
														aria-hidden="true"
														className="size-4"
														fill="none"
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
													</svg>
												</div>
												<div className="font-medium text-sm">
													Thread Summary (7 messages)
												</div>
											</div>
											<ul className="list-disc space-y-2 pl-4 text-muted-foreground text-xs">
												<li>Design team approved the new mockups.</li>
												<li>
													Engineering needs 2 more days for API integration.
												</li>
												<li>
													<span className="font-medium text-foreground">
														Action:
													</span>{" "}
													Review the timeline by EOD.
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<div
								className="grid @max-5xl:h-auto h-full grid-rows-[auto_1fr] gap-[0.5px]"
								data-slot="feature-card"
							>
								<div
									className="space-y-4 p-6 @4xl:px-12 @4xl:pt-12"
									data-grid-content="true"
									data-slot="feature-card-content"
								>
									<h3
										className="flex items-center gap-2 font-geist-mono font-semibold text-muted-foreground uppercase tracking-tight"
										data-slot="feature-card-title"
									>
										<span className="font-mono">03.</span> Command
									</h3>
									<p
										className="text-balance font-medium text-muted-foreground text-xl"
										data-slot="feature-card-description"
									>
										<span className="text-foreground">
											Universal Search & Action.
										</span>{" "}
										Press{" "}
										<kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-sans text-foreground text-sm">
											⌘ K
										</kbd>{" "}
										to instantly search emails, draft replies, or navigate your
										workspace.
									</p>
								</div>
								<div
									className="flex flex-col items-center justify-center @4xl:px-10 px-6 pt-6 @4xl:pb-12 pb-6"
									data-grid-content="true"
									data-slot="feature-card-illustration"
								>
									<div aria-hidden="true" className="w-full">
										<div className="flex flex-col overflow-hidden rounded-md border">
											<div className="flex items-center gap-2 border-border/50 border-b px-3 py-2.5">
												<svg
													aria-hidden="true"
													className="size-4 text-muted-foreground"
													fill="none"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
												>
													<circle cx="11" cy="11" r="8" />
													<path d="m21 21-4.3-4.3" />
												</svg>
												<div className="font-medium text-foreground/50 text-sm">
													Draft email to team...
												</div>
											</div>
											<div className="flex flex-col gap-1 p-2">
												<div className="flex items-center justify-between rounded-md bg-primary/10 px-2 py-1.5">
													<div className="flex items-center gap-2 font-medium text-primary text-sm">
														<svg
															aria-hidden="true"
															className="size-4"
															fill="none"
															stroke="currentColor"
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															viewBox="0 0 24 24"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
															<path d="M7 15v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4" />
														</svg>
														<span>Compose new email</span>
													</div>
													<span className="font-medium text-[10px] text-primary/70">
														Suggest
													</span>
												</div>
												<div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground text-sm">
													<svg
														aria-hidden="true"
														className="size-4"
														fill="none"
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<rect height="16" rx="2" width="20" x="2" y="4" />
														<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
													</svg>
													<span>Search &quot;team&quot; in Inbox</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="@max-2xl:hidden">
							<div data-grid-content="true"></div>
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
		</section>
	);
};
