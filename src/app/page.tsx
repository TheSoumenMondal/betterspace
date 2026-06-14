import { redirect } from "next/navigation";
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
	return <div>page</div>;
};

export default page;
