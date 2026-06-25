import Link from "next/link";
import AppLogo from "@/components/shared/app-logo";
import { Button } from "@/components/ui/button-2";
export const Navbar = () => {
	return (
		<header
			className="group sticky inset-x-0 top-0 z-50 bg-black/10 max-lg:pb-[0.5px] lg:data-scrolled:pb-[0.5px] dark:bg-white/10"
			data-state="inactive"
		>
			<div className="w-full max-lg:h-14 max-lg:overflow-hidden">
				<div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr]">
					<div
						className="grid"
						style={{ gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }}
					>
						<div
							aria-hidden="true"
							className="w-full px-[0.5px] pt-0 pb-[0.5px]"
						>
							<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
						</div>
					</div>
					<div className="mx-auto w-full max-w-276 px-[0.5px] pt-0 pb-[0.5px] lg:min-w-276">
						<div
							className="h-full rounded bg-card backdrop-blur"
							data-slot="content"
						>
							<div className="relative flex flex-wrap items-center justify-between px-6 lg:px-12 lg:py-3">
								<Link
									className="relative z-51 flex cursor-pointer justify-between gap-8 max-lg:h-14 max-lg:w-full"
									href={"/"}
								>
									<AppLogo
										className="cursor-pointer"
										logoClassName="size-5 rotate-10"
										textClassName="text-[16px]"
									/>
								</Link>
								<div className="absolute inset-0 m-auto size-fit max-lg:hidden">
									<nav
										aria-label="Main"
										className="group/navigation-menu relative flex max-w-max flex-1 items-center justify-center font-geist-mono font-semibold uppercase [--color-muted:color-mix(in_oklch,var(--color-foreground)_5%,transparent)] [--viewport-outer-px:2rem] **:data-[slot=navigation-menu-link]:relative **:data-[slot=navigation-menu-trigger]:relative **:data-[slot=navigation-menu-link]:z-51 **:data-[slot=navigation-menu-trigger]:z-51 **:data-[slot=navigation-menu-viewport]:min-w-276 max-lg:hidden"
										data-orientation="horizontal"
										data-slot="navigation-menu"
										data-viewport="true"
										dir="ltr"
									>
										<div style={{ position: "relative" }}>
											<ul
												className="group flex flex-1 list-none items-center justify-center gap-3"
												data-orientation="horizontal"
												data-slot="navigation-menu-list"
												dir="ltr"
											>
												<li
													className="relative"
													data-slot="navigation-menu-item"
												>
													<a
														className="group inline-flex h-8 w-max flex-col items-center justify-center gap-1 rounded-md p-2 px-4 py-1 font-semibold text-muted-foreground text-sm outline-none transition-[color,box-shadow] hover:bg-foreground/5 hover:text-foreground focus:bg-foreground/5 focus:text-foreground focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-foreground/2.5 data-[state=open]:bg-foreground/5 data-[active=true]:text-foreground data-[state=open]:text-foreground data-[active=true]:focus:bg-foreground/5 data-[state=open]:focus:bg-foreground/5 data-[active=true]:hover:bg-foreground/5 data-[state=open]:hover:bg-foreground/5 [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg:not([class*='text-'])]:text-muted-foreground"
														data-radix-collection-item=""
														data-slot="navigation-menu-link"
														href="/#features"
													>
														Product
													</a>
												</li>
												<li
													className="relative"
													data-slot="navigation-menu-item"
												>
													<a
														className="group inline-flex h-8 w-max flex-col items-center justify-center gap-1 rounded-md p-2 px-4 py-1 font-semibold text-muted-foreground text-sm outline-none transition-[color,box-shadow] hover:bg-foreground/5 hover:text-foreground focus:bg-foreground/5 focus:text-foreground focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-foreground/2.5 data-[state=open]:bg-foreground/5 data-[active=true]:text-foreground data-[state=open]:text-foreground data-[active=true]:focus:bg-foreground/5 data-[state=open]:focus:bg-foreground/5 data-[active=true]:hover:bg-foreground/5 data-[state=open]:hover:bg-foreground/5 [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg:not([class*='text-'])]:text-muted-foreground"
														data-radix-collection-item=""
														data-slot="navigation-menu-link"
														href="/#workflow"
													>
														Solution
													</a>
												</li>
												<li
													className="relative"
													data-slot="navigation-menu-item"
												>
													<a
														className="group inline-flex h-8 w-max flex-col items-center justify-center gap-1 rounded-md p-2 px-4 py-1 font-semibold text-muted-foreground text-sm outline-none transition-[color,box-shadow] hover:bg-foreground/5 hover:text-foreground focus:bg-foreground/5 focus:text-foreground focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-foreground/2.5 data-[state=open]:bg-foreground/5 data-[active=true]:text-foreground data-[state=open]:text-foreground data-[active=true]:focus:bg-foreground/5 data-[state=open]:focus:bg-foreground/5 data-[active=true]:hover:bg-foreground/5 data-[state=open]:hover:bg-foreground/5 [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg:not([class*='text-'])]:text-muted-foreground"
														data-radix-collection-item=""
														data-slot="navigation-menu-link"
														href="/#pricing"
													>
														Pricing
													</a>
												</li>
												<li
													className="relative"
													data-slot="navigation-menu-item"
												>
													<a
														className="group inline-flex h-8 w-max flex-col items-center justify-center gap-1 rounded-md p-2 px-4 py-1 font-semibold text-muted-foreground text-sm outline-none transition-[color,box-shadow] hover:bg-foreground/5 hover:text-foreground focus:bg-foreground/5 focus:text-foreground focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-foreground/2.5 data-[state=open]:bg-foreground/5 data-[active=true]:text-foreground data-[state=open]:text-foreground data-[active=true]:focus:bg-foreground/5 data-[state=open]:focus:bg-foreground/5 data-[active=true]:hover:bg-foreground/5 data-[state=open]:hover:bg-foreground/5 [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg:not([class*='text-'])]:text-muted-foreground"
														data-radix-collection-item=""
														data-slot="navigation-menu-link"
														href="/about"
													>
														Company
													</a>
												</li>
											</ul>
										</div>
										<div
											className="fixed inset-x-0 top-0 isolate z-50 mx-auto grid min-w-312 -translate-x-8 grid-rows-[0fr] px-(--viewport-outer-px) transition-[grid-template-rows] duration-300 ease-out has-data-[state=open]:grid-rows-[1fr]"
											data-slot="navigation-menu-viewport-parent"
										>
											<div className="-translate-x-12 overflow-hidden px-12 pb-32"></div>
										</div>
									</nav>
								</div>
								<div className="relative z-51 mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 data-[state=active]:flex max-lg:data-[state=active]:mt-6 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
									<div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
										<a href="/auth/login">
											<Button
												animation="none"
												className="w-full sm:w-auto"
												size="lg"
												variant="outline"
											>
												Log in
											</Button>
										</a>
										<a href="/auth/login">
											<Button
												animation="none"
												className="w-full sm:w-auto"
												size="lg"
												variant="info"
											>
												Get Started
											</Button>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
						className="grid"
						style={{ gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }}
					>
						<div aria-hidden="true" className="px-[0.5px] pt-0 pb-[0.5px]">
							<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
