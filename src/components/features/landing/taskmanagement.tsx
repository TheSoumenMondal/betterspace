"use client";
import { useState } from "react";
export const TaskManagement = () => {
	const [tasks, setTasks] = useState([
		{ id: 1, text: "Review daily schedule", completed: true },
		{ id: 2, text: "Reply to investor emails", completed: true },
		{ id: 3, text: "Approve design mockups", completed: true },
		{ id: 4, text: "Block deep work time", completed: false },
		{ id: 5, text: "Follow up with Sarah", completed: false },
	]);
	const toggleTask = (id: number) => {
		setTasks(
			tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
		);
	};
	const completedCount = tasks.filter((t) => t.completed).length;
	return (
		<section>
			<div className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr]">
				<div
					className="grid"
					style={{ gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }}
				>
					<div aria-hidden="true" className="w-full p-[0.5px]">
						<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
					</div>
				</div>
				<div className="mx-auto w-full max-w-276 p-[0.5px] lg:min-w-276">
					<div
						className="h-full rounded bg-card py-16 lg:py-24"
						data-slot="content"
					>
						<div className="mx-auto max-w-2xl space-y-6 text-center">
							<h2 className="text-balance font-copper-bt-regular font-semibold text-4xl text-foreground lg:text-5xl">
								Organize your day
							</h2>
							<p className="text-balance font-geist-sans text-muted-foreground text-sm">
								Get the insights of your day before you check your calendar. Be
								more production while saving your precious time.
							</p>
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
					<div className="grid *:p-[0.5px] [&_[data-grid-content]]:h-full [&_[data-grid-content]]:rounded [&_[data-grid-content]]:bg-card">
						<div className="grid @2xl:grid-cols-2 @4xl:grid-cols-10 gap-[0.5px]">
							<div aria-hidden="true" className="@max-4xl:hidden">
								<div data-grid-content="true"></div>
							</div>
							<div className="@4xl:col-span-4">
								<div
									className="@4xl:col-span-2 col-span-full grid h-full grid-rows-1 gap-[0.5px]"
									data-slot="feature-card"
								>
									<div
										className="flex h-full flex-col space-y-6 p-6 @4xl:px-12 @4xl:pt-12 @4xl:pb-12"
										data-grid-content="true"
										data-slot="feature-card-content"
									>
										<div className="flex size-12 rounded-full bg-card shadow-black/5 shadow-xl ring-1 ring-foreground/3">
											<svg
												aria-hidden="true"
												className="lucide lucide-clipboard-list m-auto size-4 text-muted-foreground"
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
												<rect
													height="4"
													rx="1"
													ry="1"
													width="8"
													x="8"
													y="2"
												></rect>
												<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
												<path d="M12 11h4"></path>
												<path d="M12 16h4"></path>
												<path d="M8 11h.01"></path>
												<path d="M8 16h.01"></path>
											</svg>
										</div>
										<h3 className="font-copper-bt-regular font-semibold text-3xl tracking-tight">
											Action Items
										</h3>
										<p className="text-balance text-muted-foreground">
											Capture action items directly from your meetings and
											emails without switching context. Turn scattered notes
											into a focused, prioritized daily list.
										</p>
										<ul className="w-full space-y-2">
											<li className="flex items-center gap-2 text-muted-foreground">
												<svg
													aria-hidden="true"
													className="lucide lucide-check size-4 text-emerald-500"
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
													<path d="M20 6 9 17l-5-5"></path>
												</svg>
												Meeting Context Integration
											</li>
											<li className="flex items-center gap-2 text-muted-foreground">
												<svg
													aria-hidden="true"
													className="lucide lucide-check size-4 text-emerald-500"
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
													<path d="M20 6 9 17l-5-5"></path>
												</svg>
												Email Thread Follow-ups
											</li>
											<li className="flex items-center gap-2 text-muted-foreground">
												<svg
													aria-hidden="true"
													className="lucide lucide-check size-4 text-emerald-500"
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
													<path d="M20 6 9 17l-5-5"></path>
												</svg>
												Calendar-Synced Deadlines
											</li>
										</ul>
										<button
											aria-label="Learn more about task management"
											className="mt-auto inline-flex h-8 w-fit cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent bg-background px-3 font-medium text-xs shadow-black/15 shadow-sm ring-1 ring-foreground/10 transition-colors duration-200 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:ring-foreground/15 dark:hover:bg-muted/50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
											type="button"
										>
											Learn more
										</button>
									</div>
								</div>
							</div>
							<div
								className="group @4xl:col-span-4 flex items-center justify-center @max-4xl:py-12 [--color-primary:var(--color-indigo-500)]"
								data-grid-content="true"
							>
								<div
									aria-hidden="true"
									className="min-w-2xs max-w-xs px-4 pt-4 selection:bg-amber-500/25"
								>
									<div className="relative">
										<div className="absolute right-1 -bottom-2 left-1 h-full rotate-2 rounded-sm bg-linear-to-br from-amber-200 to-yellow-300 shadow-sm dark:from-amber-300 dark:to-yellow-400"></div>
										<div className="absolute right-0.5 -bottom-1 left-0.5 h-full -rotate-1 rounded-sm bg-linear-to-br from-amber-100 to-yellow-200 shadow-sm dark:from-amber-200 dark:to-yellow-300"></div>
										<div className="relative rounded-sm bg-linear-to-br from-amber-100 to-yellow-200 p-5 pb-12 shadow-amber-900/15 shadow-lg dark:from-amber-300 dark:to-yellow-300">
											<div className="mb-4 flex items-center justify-between pt-2">
												<span className="font-semibold text-amber-950 text-sm">
													Today's Priorities
												</span>
												<span className="text-amber-700 text-xs">
													{completedCount}/{tasks.length}
												</span>
											</div>
											<div className="space-y-2">
												{tasks.map((task) => (
													<button
														className="flex w-full cursor-pointer items-center gap-2.5 text-left"
														key={task.id}
														onClick={() => toggleTask(task.id)}
														type="button"
													>
														{task.completed ? (
															<div className="flex size-4 items-center justify-center rounded bg-emerald-500/30">
																<svg
																	aria-hidden="true"
																	className="lucide lucide-check size-3 text-emerald-700"
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
																	<path d="M20 6 9 17l-5-5"></path>
																</svg>
															</div>
														) : (
															<svg
																aria-hidden="true"
																className="lucide lucide-circle size-4 text-amber-700/40"
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
																<circle cx="12" cy="12" r="10"></circle>
															</svg>
														)}
														<span
															className={`font-medium text-sm ${task.completed ? "text-amber-800/60 line-through" : "text-amber-900 dark:text-amber-950"}`}
														>
															{task.text}
														</span>
													</button>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div aria-hidden="true" className="@max-4xl:hidden">
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
		</section>
	);
};
