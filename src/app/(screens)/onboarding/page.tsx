import { redirect } from "next/navigation";
import OnboardingScreen from "@/components/features/onboarding/onboarding";
import { getSession } from "@/server/better-auth/server";

const page = async () => {
	const session = await getSession();
	if (session?.user.hasCompletedOnboarding) {
		redirect("/space");
	}

	return (
		<div className="w-full p-6">
			<OnboardingScreen />
		</div>
	);
};

export default page;
