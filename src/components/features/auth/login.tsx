"use client";

import { EyeClosedFreeIcons, EyeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import AppLogo from "@/components/shared/app-logo";
import { Button } from "@/components/ui/button-2";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/server/better-auth/client";

const LoginPageComponent = () => {
	const [showPassword, setShowPassword] = React.useState<boolean>(false);
	const [signInWithGoogle, setSignInWithGoogle] =
		React.useState<boolean>(false);
	const handleSignInWithGoogle = async () => {
		try {
			setSignInWithGoogle(true);
			const { data, error } = await authClient.signIn.social({
				provider: "google",
			});
			if (data) {
				console.log(data);
			} else {
				console.log(error);
			}
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "Something went wrong",
			});
		} finally {
			setSignInWithGoogle(false);
		}
	};

	return (
		<div className="flex w-full flex-col">
			<div className="flex w-full items-center justify-center">
				<AppLogo hideText logoClassName="size-8" size="lg" />
			</div>
			<div className="mt-6 mb-10 space-y-2">
				<p className="font-copper-bt-regular font-semibold text-2xl">
					Login to your account
				</p>
				<p className="font-geist-sans text-muted-foreground text-sm">
					Enter your credentials{" "}
				</p>
			</div>
			<div className="space-y-3">
				<Button
					animation="none"
					className="w-full rounded-sm py-2"
					onClick={() => handleSignInWithGoogle()}
					size="lg"
					variant="info"
				>
					{signInWithGoogle ? (
						<Spinner />
					) : (
						<svg
							id="google"
							viewBox="0 0 512 512"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Google Logo</title>
							<path
								d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"
								fill="#fbbb00"
							></path>
							<path
								d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"
								fill="#518ef8"
							></path>
							<path
								d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"
								fill="#28b446"
							></path>
							<path
								d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"
								fill="#f14336"
							></path>
						</svg>
					)}
					Continue with Google
				</Button>
			</div>
			<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3">
				<div className="h-0.5 border-card border-b bg-border"></div>
				<div className="text-center text-muted-foreground text-sm">or</div>
				<div className="h-0.5 border-card border-b bg-border"></div>
			</div>
			<form action="#" className="space-y-5">
				<div className="space-y-2">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							placeholder="Enter your email"
							type="text"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<InputGroup>
							<InputGroupAddon
								align={"inline-end"}
								className="cursor-pointer"
								onClick={() => setShowPassword(!showPassword)}
							>
								<HugeiconsIcon
									icon={showPassword ? EyeIcon : EyeClosedFreeIcons}
								/>
							</InputGroupAddon>
							<InputGroupInput
								id="password"
								name="password"
								placeholder="Enter your password"
								type={showPassword ? "text" : "password"}
							/>
						</InputGroup>
					</div>
				</div>
				<Button
					animation="none"
					className="w-full rounded-sm py-2"
					size="lg"
					variant="info"
				>
					Login with email
				</Button>
			</form>
			<div className="pt-5 text-muted-foreground text-xs">
				Don't have an account?
				<Link
					className="ml-1 font-medium text-primary hover:underline"
					href={"/auth/signup"}
				>
					Sign up
				</Link>
			</div>
		</div>
	);
};

export default LoginPageComponent;
