import type { Metadata } from "next";
import { Footer, Navbar } from "@/components/features/landing";

export const metadata: Metadata = {
	title: "Privacy Policy | betterspace",
	description: "Privacy Policy for betterspace.",
};

const PrivacyPage = () => {
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
														Privacy Policy
													</h1>
													<div className="space-y-8 font-geist-sans text-muted-foreground leading-relaxed">
														<p className="font-medium text-sm">
															Last updated: June 25, 2026
														</p>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																1. Introduction
															</h2>
															<p>
																Welcome to betterspace. We respect your privacy
																and are committed to protecting your personal
																data. This privacy policy will inform you as to
																how we look after your personal data when you
																visit our website and use our services, and tell
																you about your privacy rights and how the law
																protects you.
															</p>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																2. Data We Collect
															</h2>
															<p>
																We may collect, use, store and transfer
																different kinds of personal data about you which
																we have grouped together as follows:
															</p>
															<ul className="list-disc space-y-2 pl-6">
																<li>
																	<strong className="text-foreground">
																		Identity Data
																	</strong>{" "}
																	includes first name, last name, username or
																	similar identifier.
																</li>
																<li>
																	<strong className="text-foreground">
																		Contact Data
																	</strong>{" "}
																	includes email address and telephone numbers.
																</li>
																<li>
																	<strong className="text-foreground">
																		Technical Data
																	</strong>{" "}
																	includes internet protocol (IP) address, your
																	login data, browser type and version, time
																	zone setting and location.
																</li>
																<li>
																	<strong className="text-foreground">
																		Usage Data
																	</strong>{" "}
																	includes information about how you use our
																	website and services.
																</li>
															</ul>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																3. How We Use Your Data
															</h2>
															<p>
																We will only use your personal data when the law
																allows us to. Most commonly, we will use your
																personal data in the following circumstances:
															</p>
															<ul className="list-disc space-y-2 pl-6">
																<li>
																	Where we need to perform the contract we are
																	about to enter into or have entered into with
																	you.
																</li>
																<li>
																	Where it is necessary for our legitimate
																	interests (or those of a third party) and your
																	interests and fundamental rights do not
																	override those interests.
																</li>
																<li>
																	Where we need to comply with a legal
																	obligation.
																</li>
															</ul>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																4. Google API Services User Data Policy
															</h2>
															<p>
																betterspace's use and transfer to any other app
																of information received from Google APIs will
																adhere to{" "}
																<a
																	className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
																	href="https://developers.google.com/terms/api-services-user-data-policy"
																	rel="noopener noreferrer"
																	target="_blank"
																>
																	Google API Services User Data Policy
																</a>
																, including the Limited Use requirements.
															</p>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																5. Data Security
															</h2>
															<p>
																We have put in place appropriate security
																measures to prevent your personal data from
																being accidentally lost, used or accessed in an
																unauthorized way, altered or disclosed. In
																addition, we limit access to your personal data
																to those employees, agents, contractors and
																other third parties who have a business need to
																know.
															</p>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																6. Your Legal Rights
															</h2>
															<p>
																Under certain circumstances, you have rights
																under data protection laws in relation to your
																personal data, including the right to request
																access, correction, erasure, restriction,
																transfer, to object to processing, to
																portability of data and (where the lawful ground
																of processing is consent) to withdraw consent.
															</p>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																7. Contact Us
															</h2>
															<p>
																If you have any questions about this privacy
																policy or our privacy practices, please contact
																us at support@betterspace.com.
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

export default PrivacyPage;
