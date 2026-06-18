import { Highlighter } from "@/components/ui/highlighter";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ChatDemo } from "./chat-demo";
export const Hero = () => {
	return (
		<section className="overflow-hidden" id="home">
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
					<div className="mx-auto w-full max-w-276 p-[0.5px] lg:min-w-276">
						<div
							className="relative h-full overflow-hidden rounded bg-card/90 @4xl:px-12 px-6 py-3 text-center"
							data-slot="content"
						>
							<div className="pointer-events-none absolute inset-0" />
							<span className="relative font-geist-mono font-semibold text-foreground text-sm uppercase">
								COMMAND CENTER
							</span>
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
						<div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-card">
							<div className="grid grid-cols-10 gap-[0.5px]">
								<div aria-hidden="true" className="max-sm:hidden">
									<div data-grid-content="true"></div>
								</div>
								<div className="col-span-full sm:col-span-8">
									<div
										className="px-6 pt-24 pb-32 text-center"
										data-grid-content="true"
									>
										<div className="relative mx-auto max-w-3xl text-center">
											<h1 className="text-balance font-copper-bt-regular font-semibold text-5xl text-foreground tracking-tight lg:text-6xl">
												Give Your{" "}
												<Highlighter action="underline" color="#FF9800">
													Gmail
												</Highlighter>{" "}
												&
												<Highlighter action="underline" color="#FF9800">
													Calendar
												</Highlighter>{" "}
												a Better Space
											</h1>
											<p className="mx-auto mt-6 mb-8 text-balance text-muted-foreground text-sm">
												Connect Gmail and Google Calendar to search, organize,
												prioritize, and automate your work with AI. Spend less
												time managing and more time getting things done.
											</p>
											<a href="/auth/login">
												<RainbowButton size={"lg"} variant={"outline"}>
													Get Started
												</RainbowButton>
											</a>
											<span className="mt-3 block text-center font-geist-sans text-muted-foreground text-xs">
												Supercharge your calender and mailbox
											</span>
										</div>
									</div>
								</div>
								<div aria-hidden="true" className="max-sm:hidden">
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
				<div className="relative">
					<div className="absolute inset-0 grid grid-rows-[auto_1fr]">
						<div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr]">
							<div
								className="grid"
								style={{
									gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
								}}
							>
								<div aria-hidden="true" className="w-full p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
								<div aria-hidden="true" className="w-full p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
								<div aria-hidden="true" className="w-full p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
							</div>
							<div className="mx-auto w-full max-w-276 lg:min-w-276">
								<div className="grid *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-card">
									<div
										aria-hidden="true"
										className="col-span-full grid grid-cols-10 gap-[0.5px]"
									>
										<div className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
									</div>
									<div
										aria-hidden="true"
										className="col-span-full grid grid-cols-10 gap-[0.5px]"
									>
										<div className="aspect-square odd:rounded odd:bg-indigo-200 even:col-span-2 even:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square odd:rounded odd:bg-indigo-200 even:col-span-2 even:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square odd:rounded odd:bg-indigo-200 even:col-span-2 even:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square odd:rounded odd:bg-indigo-200 even:col-span-2 even:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square odd:rounded odd:bg-indigo-200 even:col-span-2 even:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square odd:rounded odd:bg-indigo-200 even:col-span-2 even:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square odd:rounded odd:bg-indigo-200 even:col-span-2 even:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
									</div>
									<div
										aria-hidden="true"
										className="col-span-full grid grid-cols-10 gap-[0.5px]"
									>
										<div className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
										<div className="aspect-square last:col-span-2 last:aspect-2/1 odd:col-span-2 odd:aspect-2/1">
											<div data-grid-content="true"></div>
										</div>
									</div>
								</div>
							</div>
							<div
								className="grid"
								style={{
									gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
								}}
							>
								<div aria-hidden="true" className="p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
								<div aria-hidden="true" className="p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
								<div aria-hidden="true" className="p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
							</div>
						</div>
						<div
							aria-hidden="true"
							className="@container grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr]"
						>
							<div
								className="grid"
								style={{
									gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
								}}
							>
								<div aria-hidden="true" className="w-full p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
								<div aria-hidden="true" className="w-full p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
								<div aria-hidden="true" className="w-full p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
							</div>
							<div className="mx-auto w-full max-w-276 p-[0.5px] lg:min-w-276">
								<div
									className="h-full rounded bg-card"
									data-slot="content"
								></div>
							</div>
							<div
								className="grid"
								style={{
									gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
								}}
							>
								<div aria-hidden="true" className="p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
								<div aria-hidden="true" className="p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
								<div aria-hidden="true" className="p-[0.5px]">
									<div className="h-full w-2 rounded bg-card md:w-6 lg:w-full"></div>
								</div>
							</div>
						</div>
					</div>
					<div className="-translate-y-6">
						<div className="relative h-fit">
							<div className="relative mx-auto max-w-4xl px-6">
								<div className="flex min-h-96 items-center">
									<div className="relative isolate mx-auto flex min-h-[550px] w-full max-w-5xl items-center justify-center overflow-hidden rounded-3xl bg-[url('/assets/images/background.avif')] bg-center bg-cover bg-no-repeat p-6 shadow-2xl shadow-black/10 ring-1 ring-border/50 ring-inset">
										<ChatDemo />
									</div>
								</div>
							</div>
						</div>
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
					<div className="grid grid-cols-2 *:p-[0.5px] **:data-grid-content:h-full **:data-grid-content:rounded **:data-grid-content:bg-card md:grid-cols-4 dark:bg-border">
						<div className="col-span-full">
							<div
								className="flex flex-col items-center px-6 py-16 text-center"
								data-grid-content="true"
							>
								<h2 className="font-copper-bt-regular font-semibold text-2xl text-foreground tracking-tight sm:text-3xl lg:text-4xl">
									Automate Your Daily Routines
								</h2>
								<p className="mx-auto mt-6 max-w-3xl font-geist-sans text-muted-foreground text-sm leading-relaxed">
									BetterSpace seamlessly automates your daily workflows by
									connecting directly with Google Calendar and Gmail. Let our
									intelligent agents handle your meeting scheduling, email
									drafting, and inbox organization so you can reclaim your time.
								</p>
							</div>
						</div>
						<div className="col-span-full">
							<div
								className="bg-card! px-6 py-10 text-center"
								data-grid-content="true"
							>
								<p className="font-semibold text-base text-muted-foreground uppercase tracking-widest">
									Built with cutting-edge technologies
								</p>
							</div>
						</div>
						<div>
							<div
								className="flex h-full items-center justify-center bg-muted! dark:bg-[#0a0a0a]!"
								data-grid-content="true"
							>
								<div
									className="flex h-24 items-center justify-center gap-3"
									style={{
										opacity: "1",
										filter: "blur(0px)",
										transform: "none",
									}}
								>
									<svg
										aria-hidden="true"
										className="h-6 w-6 dark:invert"
										viewBox="0 0 180 180"
										xmlns="http://www.w3.org/2000/svg"
									>
										<mask
											height="180"
											id=":r8:mask0_408_134"
											maskUnits="userSpaceOnUse"
											style={{ maskType: "alpha" }}
											width="180"
											x="0"
											y="0"
										>
											<circle cx="90" cy="90" fill="black" r="90"></circle>
										</mask>
										<g mask="url(#:r8:mask0_408_134)">
											<circle
												cx="90"
												cy="90"
												data-circle="true"
												fill="black"
												r="90"
											></circle>
											<path
												d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
												fill="url(#:r8:paint0_linear_408_134)"
											></path>
											<rect
												fill="url(#:r8:paint1_linear_408_134)"
												height="72"
												width="12"
												x="115"
												y="54"
											></rect>
										</g>
										<defs>
											<linearGradient
												gradientUnits="userSpaceOnUse"
												id=":r8:paint0_linear_408_134"
												x1="109"
												x2="144.5"
												y1="116.5"
												y2="160.5"
											>
												<stop stopColor="white"></stop>
												<stop
													offset="1"
													stopColor="white"
													stopOpacity="0"
												></stop>
											</linearGradient>
											<linearGradient
												gradientUnits="userSpaceOnUse"
												id=":r8:paint1_linear_408_134"
												x1="121"
												x2="120.799"
												y1="54"
												y2="106.875"
											>
												<stop stopColor="white"></stop>
												<stop
													offset="1"
													stopColor="white"
													stopOpacity="0"
												></stop>
											</linearGradient>
										</defs>
									</svg>
									<span className="font-bold text-2xl text-foreground/90 tracking-tighter">
										Next.js
									</span>
								</div>
							</div>
						</div>
						<div>
							<div
								className="flex h-full items-center justify-center bg-muted! dark:bg-[#0a0a0a]!"
								data-grid-content="true"
							>
								<div
									className="flex h-24 items-center justify-center gap-3"
									style={{
										opacity: "1",
										filter: "blur(0px)",
										transform: "none",
									}}
								>
									<svg
										aria-hidden="true"
										className="h-6 w-auto"
										viewBox="0 0 432.071 445.383"
										xmlns="http://www.w3.org/2000/svg"
									>
										<g
											id="orginal"
											style={{
												fillRule: "nonzero",
												clipRule: "nonzero",
												stroke: "#000000",
												strokeMiterlimit: 4,
											}}
										></g>
										<g
											id="Layer_x0020_3"
											style={{
												fillRule: "nonzero",
												clipRule: "nonzero",
												fill: "none",
												stroke: "#FFFFFF",
												strokeWidth: 12.4651,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												strokeMiterlimit: 4,
											}}
										>
											<path
												d="M323.205,324.227c2.833-23.601,1.984-27.062,19.563-23.239l4.463,0.392c13.517,0.615,31.199-2.174,41.587-7c22.362-10.376,35.622-27.7,13.572-23.148c-50.297,10.376-53.755-6.655-53.755-6.655c53.111-78.803,75.313-178.836,56.149-203.322    C352.514-5.534,262.036,26.049,260.522,26.869l-0.482,0.089c-9.938-2.062-21.06-3.294-33.554-3.496c-22.761-0.374-40.032,5.967-53.133,15.904c0,0-161.408-66.498-153.899,83.628c1.597,31.936,45.777,241.655,98.47,178.31    c19.259-23.163,37.871-42.748,37.871-42.748c9.242,6.14,20.307,9.272,31.912,8.147l0.897-0.765c-0.281,2.876-0.157,5.689,0.359,9.019c-13.572,15.167-9.584,17.83-36.723,23.416c-27.457,5.659-11.326,15.734-0.797,18.367c12.768,3.193,42.305,7.716,62.268-20.224    l-0.795,3.188c5.325,4.26,4.965,30.619,5.72,49.452c0.756,18.834,2.017,36.409,5.856,46.771c3.839,10.36,8.369,37.05,44.036,29.406c29.809-6.388,52.6-15.582,54.677-101.107"
												style={{
													fill: "#000000",
													stroke: "#000000",
													strokeWidth: 37.3953,
													strokeLinecap: "butt",
													strokeLinejoin: "miter",
												}}
											/>
											<path
												d="M402.395,271.23c-50.302,10.376-53.76-6.655-53.76-6.655c53.111-78.808,75.313-178.843,56.153-203.326c-52.27-66.785-142.752-35.2-144.262-34.38l-0.486,0.087c-9.938-2.063-21.06-3.292-33.56-3.496c-22.761-0.373-40.026,5.967-53.127,15.902    c0,0-161.411-66.495-153.904,83.63c1.597,31.938,45.776,241.657,98.471,178.312c19.26-23.163,37.869-42.748,37.869-42.748c9.243,6.14,20.308,9.272,31.908,8.147l0.901-0.765c-0.28,2.876-0.152,5.689,0.361,9.019c-13.575,15.167-9.586,17.83-36.723,23.416    c-27.459,5.659-11.328,15.734-0.796,18.367c12.768,3.193,42.307,7.716,62.266-20.224l-0.796,3.188c5.319,4.26,9.054,27.711,8.428,48.969c-0.626,21.259-1.044,35.854,3.147,47.254c4.191,11.4,8.368,37.05,44.042,29.406c29.809-6.388,45.256-22.942,47.405-50.555    c1.525-19.631,4.976-16.729,5.194-34.28l2.768-8.309c3.192-26.611,0.507-35.196,18.872-31.203l4.463,0.392c13.517,0.615,31.208-2.174,41.591-7c22.358-10.376,35.618-27.7,13.573-23.148z"
												style={{ fill: "#336791", stroke: "none" }}
											/>
											<path d="M215.866,286.484c-1.385,49.516,0.348,99.377,5.193,111.495c4.848,12.118,15.223,35.688,50.9,28.045c29.806-6.39,40.651-18.756,45.357-46.051c3.466-20.082,10.148-75.854,11.005-87.281" />
											<path d="M173.104,38.256c0,0-161.521-66.016-154.012,84.109c1.597,31.938,45.779,241.664,98.473,178.316c19.256-23.166,36.671-41.335,36.671-41.335" />
											<path d="M260.349,26.207c-5.591,1.753,89.848-34.889,144.087,34.417c19.159,24.484-3.043,124.519-56.153,203.329" />
											<path
												d="M348.282,263.953c0,0,3.461,17.036,53.764,6.653c22.04-4.552,8.776,12.774-13.577,23.155c-18.345,8.514-59.474,10.696-60.146-1.069c-1.729-30.355,21.647-21.133,19.96-28.739c-1.525-6.85-11.979-13.573-18.894-30.338    c-6.037-14.633-82.796-126.849,21.287-110.183c3.813-0.789-27.146-99.002-124.553-100.599c-97.385-1.597-94.19,119.762-94.19,119.762"
												style={{ strokeLinejoin: "bevel" }}
											/>
											<path d="M188.604,274.334c-13.577,15.166-9.584,17.829-36.723,23.417c-27.459,5.66-11.326,15.733-0.797,18.365c12.768,3.195,42.307,7.718,62.266-20.229c6.078-8.509-0.036-22.086-8.385-25.547c-4.034-1.671-9.428-3.765-16.361,3.994z" />
											<path d="M187.715,274.069c-1.368-8.917,2.93-19.528,7.536-31.942c6.922-18.626,22.893-37.255,10.117-96.339c-9.523-44.029-73.396-9.163-73.436-3.193c-0.039,5.968,2.889,30.26-1.067,58.548c-5.162,36.913,23.488,68.132,56.479,64.938" />
											<path
												d="M172.517,141.7c-0.288,2.039,3.733,7.48,8.976,8.207c5.234,0.73,9.714-3.522,9.998-5.559c0.284-2.039-3.732-4.285-8.977-5.015c-5.237-0.731-9.719,0.333-9.996,2.367z"
												style={{
													fill: "#FFFFFF",
													strokeWidth: 4.155,
													strokeLinecap: "butt",
													strokeLinejoin: "miter",
												}}
											/>
											<path
												d="M331.941,137.543c0.284,2.039-3.732,7.48-8.976,8.207c-5.238,0.73-9.718-3.522-10.005-5.559c-0.277-2.039,3.74-4.285,8.979-5.015c5.239-0.73,9.718,0.333,10.002,2.368z"
												style={{
													fill: "#FFFFFF",
													strokeWidth: 2.0775,
													strokeLinecap: "butt",
													strokeLinejoin: "miter",
												}}
											/>
											<path d="M350.676,123.432c0.863,15.994-3.445,26.888-3.988,43.914c-0.804,24.748,11.799,53.074-7.191,81.435" />
											<path d="M0,60.232" style={{ strokeWidth: 3 }} />
										</g>
									</svg>
									<span className="font-bold text-foreground/90 text-xl tracking-tight">
										PostgreSQL
									</span>
								</div>
							</div>
						</div>
						<div>
							<div
								className="flex h-full items-center justify-center bg-muted! dark:bg-[#0a0a0a]!"
								data-grid-content="true"
							>
								<div
									className="flex h-24 items-center justify-center gap-2"
									style={{
										opacity: "1",
										filter: "blur(0px)",
										transform: "none",
									}}
								>
									<svg
										aria-hidden="true"
										className="h-5 w-auto fill-foreground"
										viewBox="0 0 1180 320"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="m367.44 153.84c0 52.32 33.6 88.8 80.16 88.8s80.16-36.48 80.16-88.8-33.6-88.8-80.16-88.8-80.16 36.48-80.16 88.8zm129.6 0c0 37.44-20.4 61.68-49.44 61.68s-49.44-24.24-49.44-61.68 20.4-61.68 49.44-61.68 49.44 24.24 49.44 61.68z" />
										<path d="m614.27 242.64c35.28 0 55.44-29.76 55.44-65.52s-20.16-65.52-55.44-65.52c-16.32 0-28.32 6.48-36.24 15.84v-13.44h-28.8v169.2h28.8v-56.4c7.92 9.36 19.92 15.84 36.24 15.84zm-36.96-69.12c0-23.76 13.44-36.72 31.2-36.72 20.88 0 32.16 16.32 32.16 40.32s-11.28 40.32-32.16 40.32c-17.76 0-31.2-13.2-31.2-36.48z" />
										<path d="m747.65 242.64c25.2 0 45.12-13.2 54-35.28l-24.72-9.36c-3.84 12.96-15.12 20.16-29.28 20.16-18.48 0-31.44-13.2-33.6-34.8h88.32v-9.6c0-34.56-19.44-62.16-55.92-62.16s-60 28.56-60 65.52c0 38.88 25.2 65.52 61.2 65.52zm-1.44-106.8c18.24 0 26.88 12 27.12 25.92h-57.84c4.32-17.04 15.84-25.92 30.72-25.92z" />
										<path d="m823.98 240h28.8v-73.92c0-18 13.2-27.6 26.16-27.6 15.84 0 22.08 11.28 22.08 26.88v74.64h28.8v-83.04c0-27.12-15.84-45.36-42.24-45.36-16.32 0-27.6 7.44-34.8 15.84v-13.44h-28.8z" />
										<path d="m1014.17 67.68-65.28 172.32h30.48l14.64-39.36h74.4l14.88 39.36h30.96l-65.28-172.32zm16.8 34.08 27.36 72h-54.24z" />
										<path d="m1163.69 68.18h-30.72v172.32h30.72z" />
										<path d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z" />
									</svg>
								</div>
							</div>
						</div>
						<div>
							<div
								className="flex h-full items-center justify-center bg-muted! dark:bg-[#0a0a0a]!"
								data-grid-content="true"
							>
								<div
									className="flex h-24 items-center justify-center gap-3"
									style={{
										opacity: "1",
										filter: "blur(0px)",
										transform: "none",
									}}
								>
									<span className="font-bold text-foreground/90 text-xl tracking-tight">
										corsair.dev
									</span>
								</div>
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
