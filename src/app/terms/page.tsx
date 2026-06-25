import type { Metadata } from "next";
import { Footer, Navbar } from "@/components/features/landing";

export const metadata: Metadata = {
	title: "Terms of Service | betterspace",
	description: "Terms of Service for betterspace.",
};

const TermsPage = () => {
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
														Terms of Service
													</h1>
													<div className="space-y-8 font-geist-sans text-muted-foreground leading-relaxed">
														<p className="font-medium text-sm">
															Last updated: June 25, 2026
														</p>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																1. Agreement to Terms
															</h2>
															<p>
																By accessing or using the betterspace website
																and services, you agree to be bound by these
																Terms of Service and all applicable laws and
																regulations. If you do not agree with any of
																these terms, you are prohibited from using or
																accessing this site.
															</p>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																2. Use License
															</h2>
															<p>
																Permission is granted to temporarily download
																one copy of the materials (information or
																software) on betterspace's website for personal,
																non-commercial transitory viewing only. This is
																the grant of a license, not a transfer of title,
																and under this license you may not:
															</p>
															<ul className="list-disc space-y-2 pl-6">
																<li>modify or copy the materials;</li>
																<li>
																	use the materials for any commercial purpose,
																	or for any public display;
																</li>
																<li>
																	attempt to decompile or reverse engineer any
																	software contained on betterspace's website;
																</li>
																<li>
																	remove any copyright or other proprietary
																	notations from the materials; or
																</li>
																<li>
																	transfer the materials to another person or
																	"mirror" the materials on any other server.
																</li>
															</ul>
															<p>
																This license shall automatically terminate if
																you violate any of these restrictions and may be
																terminated by betterspace at any time.
															</p>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																3. Disclaimer
															</h2>
															<p>
																The materials on betterspace's website are
																provided on an 'as is' basis. betterspace makes
																no warranties, expressed or implied, and hereby
																disclaims and negates all other warranties
																including, without limitation, implied
																warranties or conditions of merchantability,
																fitness for a particular purpose, or
																non-infringement of intellectual property or
																other violation of rights.
															</p>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																4. Limitations
															</h2>
															<p>
																In no event shall betterspace or its suppliers
																be liable for any damages (including, without
																limitation, damages for loss of data or profit,
																or due to business interruption) arising out of
																the use or inability to use the materials on
																betterspace's website, even if betterspace or a
																betterspace authorized representative has been
																notified orally or in writing of the possibility
																of such damage.
															</p>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																5. Accuracy of Materials
															</h2>
															<p>
																The materials appearing on betterspace's website
																could include technical, typographical, or
																photographic errors. betterspace does not
																warrant that any of the materials on its website
																are accurate, complete or current. betterspace
																may make changes to the materials contained on
																its website at any time without notice. However,
																betterspace does not make any commitment to
																update the materials.
															</p>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																6. Links
															</h2>
															<p>
																betterspace has not reviewed all of the sites
																linked to its website and is not responsible for
																the contents of any such linked site. The
																inclusion of any link does not imply endorsement
																by betterspace of the site. Use of any such
																linked website is at the user's own risk.
															</p>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																7. Modifications
															</h2>
															<p>
																betterspace may revise these Terms of Service
																for its website at any time without notice. By
																using this website you are agreeing to be bound
																by the then current version of these Terms of
																Service.
															</p>
														</section>

														<section className="space-y-4">
															<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight">
																8. Governing Law
															</h2>
															<p>
																These terms and conditions are governed by and
																construed in accordance with the laws and you
																irrevocably submit to the exclusive jurisdiction
																of the courts in that State or location.
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

export default TermsPage;
