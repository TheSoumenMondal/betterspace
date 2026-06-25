"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AppLogo from "@/components/shared/app-logo";
import { Button } from "@/components/ui/button-2";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/server/better-auth/client";

const RESEND_COOLDOWN = 60;

const VerifyEmailPageComponent = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const email = searchParams.get("email") ?? "";

	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [resending, setResending] = useState(false);
	const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
	const [canResend, setCanResend] = useState(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const startCountdown = useCallback(() => {
		setCanResend(false);
		setCountdown(RESEND_COOLDOWN);
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					if (intervalRef.current) clearInterval(intervalRef.current);
					setCanResend(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}, []);

	// Start countdown on mount (OTP already sent from login/signup)
	useEffect(() => {
		startCountdown();
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [startCountdown]);

	const handleResendOtp = async () => {
		if (!canResend || !email) return;
		try {
			setResending(true);
			const { error } = await authClient.emailOtp.sendVerificationOtp({
				email,
				type: "email-verification",
			});
			if (error) {
				toast.error("Error", { description: error.message });
			} else {
				toast.success("OTP resent! Check your inbox.");
				startCountdown();
			}
		} catch {
			toast.error("Error", { description: "Could not resend OTP." });
		} finally {
			setResending(false);
		}
	};

	const handleVerify = useCallback(async () => {
		if (otp.length !== 6) {
			toast.error("Error", { description: "Please enter the 6-digit OTP." });
			return;
		}
		if (!email) {
			toast.error("Error", {
				description: "Email is missing. Please sign in again.",
			});
			return;
		}
		try {
			setLoading(true);
			const { error } = await authClient.emailOtp.verifyEmail({
				email,
				otp,
			});
			if (error) {
				toast.error("Verification failed", { description: error.message });
				setOtp("");
			} else {
				toast.success("Email verified! Welcome to BetterSpace.");
				// Session is now updated — redirect to onboarding
				router.push("/onboarding");
			}
		} catch {
			toast.error("Error", { description: "Something went wrong." });
		} finally {
			setLoading(false);
		}
	}, [email, otp, router]);

	// Auto-submit when all 6 digits are entered
	useEffect(() => {
		if (otp.length === 6) {
			handleVerify();
		}
	}, [otp, handleVerify]);

	return (
		<div className="flex w-full flex-col">
			<div className="flex w-full items-center justify-center">
				<AppLogo hideText logoClassName="size-8" size="lg" />
			</div>

			<div className="mt-6 mb-10 space-y-2">
				<p className="font-copper-bt-regular font-semibold text-2xl">
					Verify your email
				</p>
				<p className="font-geist-sans text-muted-foreground text-sm">
					We sent a 6-digit code to{" "}
					{email ? (
						<span className="font-medium text-foreground">{email}</span>
					) : (
						"your email"
					)}
					. Enter it below to verify your account.
				</p>
			</div>

			{/* OTP Input */}
			<div className="flex flex-col items-center gap-6">
				<InputOTP
					disabled={loading}
					maxLength={6}
					onChange={setOtp}
					value={otp}
				>
					<InputOTPGroup className="gap-2">
						{Array.from({ length: 6 }).map((_, i) => (
							<InputOTPSlot
								className="size-11 rounded-md border text-base"
								index={i}
								// biome-ignore lint/suspicious/noArrayIndexKey: index is stable
								key={i}
							/>
						))}
					</InputOTPGroup>
				</InputOTP>

				<Button
					animation="none"
					className="w-full rounded-sm py-2"
					disabled={loading || otp.length !== 6}
					onClick={handleVerify}
					size="lg"
					type="button"
					variant="info"
				>
					{loading ? <Spinner /> : "Verify Email"}
				</Button>
			</div>

			{/* Resend */}
			<div className="mt-6 text-center text-muted-foreground text-sm">
				Didn&apos;t receive the code?{" "}
				{canResend ? (
					<button
						className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
						disabled={resending}
						onClick={handleResendOtp}
						type="button"
					>
						{resending ? "Sending…" : "Resend OTP"}
					</button>
				) : (
					<span className="font-medium text-foreground/60">
						Resend in {countdown}s
					</span>
				)}
			</div>
		</div>
	);
};

export default function VerifyEmailPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen items-center justify-center">
					<Spinner />
				</div>
			}
		>
			<VerifyEmailPageComponent />
		</Suspense>
	);
}
