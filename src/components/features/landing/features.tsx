export const Features = () => {
	return (
		<section
			className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr]"
			id="features"
		>
			<div
				className="grid"
				style={{ gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }}
			>
				<div aria-hidden="true" className="w-full p-[0.5px]">
					<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
				</div>
			</div>
			<div className="mx-auto w-full max-w-276 lg:min-w-276">
				<div className="relative grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-card">
					<h2 className="sr-only">Features</h2>
					<div className="grid @2xl:grid-cols-2 @4xl:grid-cols-10 gap-[0.5px] [--color-primary:var(--color-indigo-500)]">
						<div className="@max-4xl:hidden">
							<div data-grid-content="true"></div>
						</div>
						<div className="@4xl:col-span-4">
							<div
								className="grid h-full grid-rows-[auto_1fr] gap-[0.5px]"
								data-slot="feature-card"
							>
								<div
									className="space-y-4 p-6 @4xl:px-12 @4xl:pt-12"
									data-grid-content="true"
									data-slot="feature-card-content"
								>
									<h3
										className="flex items-center gap-2 text-muted-foreground"
										data-slot="feature-card-title"
									>
										<svg
											aria-hidden="true"
											className="lucide lucide-message-square size-4"
											fill="none"
											height="24"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											viewBox="0 0 24 24"
											width="24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
										</svg>
										Conversational Assistant
									</h3>
									<p
										className="font-medium text-muted-foreground text-xl"
										data-slot="feature-card-description"
									>
										<span className="text-foreground">
											Manage your day through chat.
										</span>{" "}
										Ask your AI agent to schedule meetings, draft emails, or
										search your inbox.
									</p>
								</div>
								<div
									className="flex flex-col items-center justify-center @4xl:px-12 px-6 pt-6 @4xl:pb-12 pb-6"
									data-grid-content="true"
									data-slot="feature-card-illustration"
								>
									<div
										aria-hidden="true"
										className="flex w-full flex-col gap-3 text-sm"
									>
										<div className="max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground shadow-sm">
											Schedule a product review with the team for tomorrow.
										</div>
										<div className="flex gap-2">
											<div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
												<svg
													aria-hidden="true"
													className="size-3.5 text-primary"
													fill="none"
													stroke="currentColor"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
												</svg>
											</div>
											<div className="self-start rounded-2xl rounded-tl-sm bg-muted/50 px-4 py-2.5 text-foreground shadow-sm ring-1 ring-border-illustration">
												I've drafted a meeting invite for tomorrow at 2:00 PM
												based on everyone's availability. Shall I send it?
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="@4xl:col-span-4">
							<div
								className="grid h-full grid-rows-[auto_1fr] gap-[0.5px]"
								data-slot="feature-card"
							>
								<div
									className="space-y-4 p-6 @4xl:px-12 @4xl:pt-12"
									data-grid-content="true"
									data-slot="feature-card-content"
								>
									<h3
										className="flex items-center gap-2 text-muted-foreground"
										data-slot="feature-card-title"
									>
										<svg
											aria-hidden="true"
											className="lucide lucide-shield-check size-4"
											fill="none"
											height="24"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											viewBox="0 0 24 24"
											width="24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-3 5.98-5.35.47-.56 1.2-.56 1.67 0C14 2 16 4 18 5a1 1 0 0 1 1 1z" />
											<path d="m9 12 2 2 4-4" />
										</svg>
										You're Always in Control
									</h3>
									<p
										className="font-medium text-muted-foreground text-xl"
										data-slot="feature-card-description"
									>
										<span className="text-foreground">
											No surprises or accidental emails.
										</span>{" "}
										BetterSpace always summarizes its proposed actions and asks
										for your explicit confirmation before execution.
									</p>
								</div>
								<div
									className="flex flex-col items-center justify-center @4xl:px-12 px-6 pt-6 @4xl:pb-12 pb-6"
									data-grid-content="true"
									data-slot="feature-card-illustration"
								>
									<div aria-hidden="true" className="w-full">
										<div className="overflow-hidden rounded-xl bg-illustration shadow-black/6.5 shadow-lg ring-1 ring-border-illustration">
											<div className="border-border/50 border-b bg-muted/30 px-4 py-3">
												<div className="font-semibold text-xs">
													Action Required
												</div>
											</div>
											<div className="space-y-3 bg-background p-4">
												<p className="text-muted-foreground text-sm">
													I've drafted a reply to <strong>Sarah</strong> with
													the Q3 figures attached. Shall I send this email?
												</p>
												<div className="flex items-center gap-2 pt-1">
													<button
														className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground text-xs shadow-sm hover:bg-primary/90"
														type="button"
													>
														Confirm & Send
													</button>
													<button
														className="rounded-md px-3 py-1.5 font-medium text-muted-foreground text-xs ring-1 ring-border transition-colors hover:bg-muted/50"
														type="button"
													>
														Cancel
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="@max-4xl:hidden">
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
		</section>
	);
};
