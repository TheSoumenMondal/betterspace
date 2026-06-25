"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button as Button2 } from "@/components/ui/button-2";

export function DemoLoginAlert() {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsOpen(true);
		}, 10000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<AlertDialog onOpenChange={setIsOpen} open={isOpen}>
			<AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[500px]">
				<div className="relative h-[160px] w-full bg-muted">
					{/* biome-ignore lint/performance/noImgElement: intentional for demo */}
					<img
						alt="Unlock BetterSpace"
						className="h-full w-full object-cover"
						src="/dialogimage.png"
					/>
				</div>
				<div className="flex flex-col gap-6 p-6 px-8">
					<div className="space-y-4">
						<AlertDialogTitle className="flex items-center gap-3 font-medium text-2xl tracking-tight">
							Unlock BetterSpace
						</AlertDialogTitle>
						<AlertDialogDescription className="text-[15px] text-muted-foreground leading-relaxed">
							You are currently exploring the demo version of BetterSpace. Log
							in to experience the full power of your AI assistant with your
							real emails and calendar events.
						</AlertDialogDescription>
					</div>
					<div className="mt-2 flex items-center justify-between gap-4">
						<Button2
							className="h-9 flex-1 rounded-full text-sm"
							onClick={() => router.push("/auth/login")}
							variant="info"
						>
							Log In
						</Button2>
						<Button2
							className="h-9 flex-1 rounded-full border-none bg-transparent font-medium text-muted-foreground text-sm shadow-none hover:bg-transparent hover:text-foreground"
							onClick={() => setIsOpen(false)}
							variant="outline"
						>
							Maybe later
						</Button2>
					</div>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
