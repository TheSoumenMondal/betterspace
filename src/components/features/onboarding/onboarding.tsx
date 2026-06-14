"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { GoogleCalendarIcon } from "@/components/icons/calendar";
import { GmailIcon } from "@/components/icons/gmail";
import LogOutButton from "@/components/shared/logout-button";
import { Button } from "@/components/ui/button-2";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/trpc/react";

export default function OnboardingScreen() {
	const router = useRouter();

	const gmailStatus = api.account.checkServiceConnectionStatus.useQuery(
		{ corsairIntegrationName: "gmail" },
		{ refetchOnWindowFocus: false },
	);
	const calendarStatus = api.account.checkServiceConnectionStatus.useQuery(
		{ corsairIntegrationName: "googlecalendar" },
		{ refetchOnWindowFocus: false },
	);

	const [connectingGmail, setConnectingGmail] = React.useState(false);
	const [connectingCalendar, setConnectingCalendar] = React.useState(false);

	const mailChecking = gmailStatus.isLoading;
	const calendarChecking = calendarStatus.isLoading;

	const mailConnected = gmailStatus.data?.serviceConnectionStatus ?? false;
	const calendarConnected =
		calendarStatus.data?.serviceConnectionStatus ?? false;

	const completeOnboarding = api.account.updateOnboardingStatus.useMutation({
		onSuccess: () => {
			router.push("/space");
		},
	});

	React.useEffect(() => {
		if (
			mailConnected &&
			calendarConnected &&
			!completeOnboarding.isPending &&
			!completeOnboarding.isSuccess
		) {
			completeOnboarding.mutate();
		}
	}, [mailConnected, calendarConnected, completeOnboarding]);

	const handleConnectGmail = () => {
		setConnectingGmail(true);
		window.location.href = "/api/auth/google/authorize?plugin=gmail";
	};

	const handleConnectCalendar = () => {
		setConnectingCalendar(true);
		window.location.href = "/api/auth/google/authorize?plugin=googlecalendar";
	};

	return (
		<section className="flex min-h-[calc(100vh-3rem)] w-full items-center">
			<div className="mx-auto w-full max-w-5xl">
				<div className="mx-auto flex max-w-2xl flex-col gap-6">
					<div className="space-y-3">
						<h2 className="font-copper-bt-regular font-semibold text-3xl text-foreground sm:text-4xl">
							Connect your Gmail and Calendar
						</h2>
						<p className="font-geist-sans text-muted-foreground text-sm">
							Give your AI assistant secure access to your inbox and calendar to
							automatically manage emails, schedule meetings, send invitations,
							and handle follow-ups on your behalf.
						</p>
					</div>

					<div className="relative overflow-hidden rounded-3xl">
						<Image
							alt="background_onboarding"
							className="absolute inset-0 size-full object-cover"
							fill
							src={"/assets/images/background_onboarding.avif"}
						/>

						<div className="relative m-4 overflow-hidden rounded-(--radius) border bg-card shadow-black/15 shadow-xl sm:m-8 md:m-12">
							<div className="h-auto w-full space-y-5 p-6">
								<ServiceRow
									connectLabel="Connect Gmail"
									icon={<GmailIcon />}
									isChecking={mailChecking}
									isConnected={mailConnected}
									isConnecting={connectingGmail}
									label="Connect your Gmail Inbox"
									onConnect={handleConnectGmail}
								/>

								<ServiceRow
									connectLabel="Connect Calendar"
									icon={<GoogleCalendarIcon />}
									isChecking={calendarChecking}
									isConnected={calendarConnected}
									isConnecting={connectingCalendar}
									label="Connect your Google Calendar"
									onConnect={handleConnectCalendar}
								/>

								{completeOnboarding.isPending && (
									<div className="flex items-center justify-center gap-2 pt-2 text-muted-foreground text-sm">
										<Spinner />
										<span>Setting up your workspace…</span>
									</div>
								)}
							</div>
							<div className="flex items-center justify-center gap-2 border-t p-3 text-center font-geist-sans text-xs">
								<p>Choose a wrong account ?</p>{" "}
								<LogOutButton size="xs" variant="ghost" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function ServiceRow({
	label,
	isChecking,
	isConnected,
	isConnecting,
	onConnect,
	connectLabel,
	icon,
}: {
	label: string;
	isChecking: boolean;
	isConnected: boolean;
	isConnecting: boolean;
	onConnect: () => void;
	connectLabel: string;
	icon: React.ReactNode;
}) {
	const isBusy = isChecking || isConnecting;

	return (
		<div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
			<p className="font-geist-sans">{label}</p>
			<Button
				animation="none"
				className="w-60 font-geist-mono uppercase"
				disabled={isBusy || isConnected}
				onClick={onConnect}
				variant="info"
			>
				{isChecking ? (
					<>
						<Spinner />
						<span>Checking Connection Status</span>
					</>
				) : isConnected ? (
					<>
						<CheckCircle2 className="size-4" />
						<span>Already Connected</span>
					</>
				) : isConnecting ? (
					<>
						<Spinner />
						<span>Connecting…</span>
					</>
				) : (
					<>
						{icon}
						<span>{connectLabel}</span>
					</>
				)}
			</Button>
		</div>
	);
}
