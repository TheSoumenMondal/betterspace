"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button-2";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
		preferences: {
			title: "Workflow Settings",
			desc: "Configure how you interact with Betterspace.",
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
						<TabsTrigger value="preferences">Preferences</TabsTrigger>
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

						<TabsContent className="mt-0 space-y-8" value="preferences">
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="font-copper-bt-regular text-base">
										Advance Keyboard Shortcuts
									</Label>
									<p className="font-geist-sans text-muted-foreground text-sm">
										Enable Superhuman-style keyboard shortcuts across the app.
									</p>
								</div>
								<Switch
									defaultChecked={user.isPremium}
									disabled={!user.isPremium}
									id="keyboard-shortcuts"
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="font-copper-bt-regular text-base">
										AI Auto-Tagging
									</Label>
									<p className="font-geist-sans text-muted-foreground text-sm">
										Automatically tag incoming emails for priority and
										importance.
									</p>
								</div>
								<Switch
									defaultChecked={user.isPremium}
									disabled={!user.isPremium}
									id="ai-tagging"
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="font-copper-bt-regular text-base">
										Auto-generate Summaries
									</Label>
									<p className="font-geist-sans text-muted-foreground text-sm">
										Let AI generate quick summaries for long email threads.
									</p>
								</div>
								<Switch
									defaultChecked={user.isPremium}
									disabled={!user.isPremium}
									id="ai-summaries"
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="font-copper-bt-regular text-base">
										Extract Action Items
									</Label>
									<p className="font-geist-sans text-muted-foreground text-sm">
										Automatically identify and list action items from emails.
									</p>
								</div>
								<Switch
									defaultChecked={user.isPremium}
									disabled={!user.isPremium}
									id="ai-action-items"
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="font-copper-bt-regular text-base">
										Extract Entities
									</Label>
									<p className="font-geist-sans text-muted-foreground text-sm">
										Detect persons, organizations, locations, and dates.
									</p>
								</div>
								<Switch
									defaultChecked={user.isPremium}
									disabled={!user.isPremium}
									id="ai-entities"
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="font-copper-bt-regular text-base">
										Flag Meeting Signals
									</Label>
									<p className="font-geist-sans text-muted-foreground text-sm">
										Highlight emails that look like meeting requests or
										scheduling.
									</p>
								</div>
								<Switch
									defaultChecked={user.isPremium}
									disabled={!user.isPremium}
									id="ai-meetings"
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="font-copper-bt-regular text-base">
										Flag Deadlines & Invoices
									</Label>
									<p className="font-geist-sans text-muted-foreground text-sm">
										Highlight emails containing important deadlines or payment
										invoices.
									</p>
								</div>
								<Switch
									defaultChecked={user.isPremium}
									disabled={!user.isPremium}
									id="ai-deadlines"
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label className="font-copper-bt-regular text-base">
										Direct Search from gmail
									</Label>
									<p className="font-geist-sans text-muted-foreground text-sm">
										Local data may not be up-to-date. Search directly from Gmail
										for the most accurate results.
									</p>
								</div>
								<Switch
									defaultChecked={user.isPremium}
									disabled={!user.isPremium}
									id="direct-search"
								/>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
