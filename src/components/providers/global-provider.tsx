"use client";

import type React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { NavSlotProvider } from "../features/sidebar/navslot-context";
import { ThemeProvider } from "./theme-provider";

type Props = {
	children: React.ReactNode;
};

const GlobalProviderWrapper = ({ children }: Props) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			disableTransitionOnChange
			enableSystem
		>
			<TRPCReactProvider>
				<NavSlotProvider>{children}</NavSlotProvider>
			</TRPCReactProvider>
			<Toaster />
		</ThemeProvider>
	);
};

export default GlobalProviderWrapper;
