"use client";

import type React from "react";
import { TRPCReactProvider } from "@/trpc/react";
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
			<TRPCReactProvider>{children}</TRPCReactProvider>
		</ThemeProvider>
	);
};

export default GlobalProviderWrapper;
