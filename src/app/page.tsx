import { redirect } from "next/navigation";
import {
	Features,
	Footer,
	Hero,
	Navbar,
	Pricing,
	TaskManagement,
	Workflow,
} from "@/components/features/landing";

import { getSession } from "@/server/better-auth/server";

const page = async () => {
	const session = await getSession();
	if (session) {
		if (session.user.hasCompletedOnboarding) {
			redirect("/space");
		} else {
			redirect("/onboarding");
		}
	}
	return (
		<div className="min-h-screen w-full bg-background font-sans antialiased">
			<Navbar />
			<main className="relative z-0 flex flex-col bg-black/10 dark:bg-white/10">
				<Hero />
				<Features />
				<Workflow />
				<TaskManagement />
				<Pricing />
			</main>
			<Footer />
		</div>
	);
};

export default page;
