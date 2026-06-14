"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { authClient } from "@/server/better-auth/client";
import { Button } from "../ui/button-2";
import { Spinner } from "../ui/spinner";

type Props = {
	size?:
		| "default"
		| "lg"
		| "xs"
		| "sm"
		| "icon"
		| "icon-xs"
		| "icon-sm"
		| "icon-lg";
	variant?:
		| "default"
		| "link"
		| "success"
		| "destructive"
		| "secondary"
		| "decorations"
		| "muted"
		| "outline"
		| "ghost"
		| "info"
		| "warning"
		| "raised";
};

const LogOutButton = ({ size, variant }: Props) => {
	const router = useRouter();
	const [isLoggingOut, setIsLoggingOut] = React.useState<boolean>(false);
	const handleLogout = async () => {
		setIsLoggingOut(true);
		await authClient.signOut();
		setIsLoggingOut(false);
		router.replace("/auth/login");
	};
	return (
		<Button onClick={handleLogout} size={size} variant={variant}>
			Log Out
			{isLoggingOut && <Spinner />}
		</Button>
	);
};

export default LogOutButton;
