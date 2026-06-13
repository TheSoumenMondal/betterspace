import { redirect } from "next/navigation";
import type React from "react";
import { getSession } from "@/server/better-auth/server";

type Props = {
	children: React.ReactNode;
};

const layout = async ({ children }: Props) => {
	const session = await getSession();
	if (!session) {
		redirect("/auth/login");
	}
	return <div>{children}</div>;
};

export default layout;
