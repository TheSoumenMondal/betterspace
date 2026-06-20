"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button-2";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SettingsClientProps = {
	user: {
		name: string;
		email: string;
		image?: string | null;
		isPremium?: boolean;
	};
	integrations: {
		gmailConnected: boolean;
		calendarConnected: boolean;
	};
};

export function SettingsClient({ user, integrations }: SettingsClientProps) {
	const { theme, setTheme } = useTheme();
	const [activeTab, setActiveTab] = useState("general");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const tabInfo = {
		general: {
			title: "General",
			desc: "Manage your personal information and appearance.",
		},
		integrations: {
			title: "Corsair Integration",
			desc: "Manage your connection to Gmail and Google Calendar.",
		},
	};

	return (
		<div className="flex h-full w-full flex-col">
			<div className="mx-auto flex w-full max-w-5xl flex-col justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center lg:px-10">
				<div className="space-y-1">
					<h2 className="font-copper-bt-regular font-semibold text-2xl">
						{tabInfo[activeTab as keyof typeof tabInfo].title}
					</h2>
					<p className="font-geist-sans text-muted-foreground">
						{tabInfo[activeTab as keyof typeof tabInfo].desc}
					</p>
				</div>
				<Tabs className="w-auto" onValueChange={setActiveTab} value={activeTab}>
					<TabsList>
						<TabsTrigger value="general">General</TabsTrigger>
						<TabsTrigger value="integrations">Integrations</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="flex-1 overflow-y-auto">
				<div className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-10">
					<Tabs className="w-full" value={activeTab}>
						<TabsContent className="mt-0 space-y-10" value="general">
							<div className="space-y-4">
								<h3 className="font-copper-bt-regular font-medium text-xl">
									Profile
								</h3>
								<div className="flex items-center gap-6">
									<Avatar className="h-20 w-20">
										<AvatarImage src={user.image ?? ""} />
										<AvatarFallback className="text-2xl">
											{user.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div className="space-y-1">
										<h4 className="font-geist-sans font-medium text-lg">
											{user.name}
										</h4>
										<p className="font-geist-sans text-muted-foreground text-sm">
											{user.email}
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<h3 className="font-copper-bt-regular font-medium text-xl">
									Appearance
								</h3>
								<div className="flex w-full items-center gap-4">
									<Button
										className="flex h-20 flex-1 flex-col gap-2"
										onClick={() => setTheme("light")}
										variant={theme === "light" ? "default" : "outline"}
									>
										<SunIcon className="h-6 w-6" />
										Light
									</Button>
									<Button
										className="flex h-20 flex-1 flex-col gap-2"
										onClick={() => setTheme("dark")}
										variant={theme === "dark" ? "default" : "outline"}
									>
										<MoonIcon className="h-6 w-6" />
										Dark
									</Button>
									<Button
										className="flex h-20 flex-1 flex-col gap-2"
										onClick={() => setTheme("system")}
										variant={theme === "system" ? "default" : "outline"}
									>
										<MonitorIcon className="h-6 w-6" />
										System
									</Button>
								</div>
							</div>
						</TabsContent>

						<TabsContent className="mt-0 space-y-4" value="integrations">
							<div className="flex items-center justify-between rounded-lg py-4">
								<div className="space-y-0.5">
									<h4 className="font-copper-bt-regular font-medium text-base">
										Gmail API
									</h4>
									<p className="text-muted-foreground text-sm">
										{integrations.gmailConnected
											? "Connected and syncing emails."
											: "Not connected."}
									</p>
								</div>
								<Button
									className={
										integrations.gmailConnected
											? "border border-green-600/20 border-dashed bg-green-50/50 text-green-600 shadow-none ring-0 hover:bg-green-50 dark:bg-green-500/10 dark:hover:bg-green-500/20"
											: "border-0 shadow-none ring-0"
									}
									size="sm"
									variant="outline"
								>
									{integrations.gmailConnected ? "Connected" : "Connect"}
								</Button>
							</div>
							<div className="flex items-center justify-between rounded-lg py-4">
								<div className="space-y-0.5">
									<h4 className="font-copper-bt-regular font-medium text-base">
										Google Calendar API
									</h4>
									<p className="text-muted-foreground text-sm">
										{integrations.calendarConnected
											? "Connected and syncing events."
											: "Not connected."}
									</p>
								</div>
								<Button
									className={
										integrations.calendarConnected
											? "border border-green-600/20 border-dashed bg-green-50/50 text-green-600 shadow-none ring-0 hover:bg-green-50 dark:bg-green-500/10 dark:hover:bg-green-500/20"
											: "border-0 shadow-none ring-0"
									}
									size="sm"
									variant="outline"
								>
									{integrations.calendarConnected ? "Connected" : "Connect"}
								</Button>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
