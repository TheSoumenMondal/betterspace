import "@/styles/globals.css";

import type { Metadata } from "next";
import { Anton_SC, Geist, Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import GlobalProviderWrapper from "@/components/providers/global-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "betterspace",
	description:
		"Connect Gmail and Google Calendar to let AI schedule meetings, send invitations, manage follow-ups, and organize your inbox automatically.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
	weight: ["400", "500", "600", "700"],
});

const antonSC = Anton_SC({
	variable: "--font-anton-sc",
	subsets: ["latin"],
	weight: ["400"],
});

const copperBtRegular = localFont({
	src: "../../public/assets/fonts/copper_bt_regular.woff",
	variable: "--font-copper-bt-regular",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			className={cn(
				"overscroll-none",
				geist.variable,
				geistMono.variable,
				copperBtRegular.variable,
				antonSC.variable,
				"font-sans",
				inter.variable,
			)}
			lang="en"
			suppressHydrationWarning
		>
			<body suppressHydrationWarning>
				<GlobalProviderWrapper>{children}</GlobalProviderWrapper>
			</body>
		</html>
	);
}
