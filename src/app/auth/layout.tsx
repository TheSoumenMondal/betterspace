import Image from "next/image";
import type * as React from "react";

type Props = {
	children: React.ReactNode;
};

const layout = ({ children }: Props) => {
	return (
		<div className="grid min-h-dvh grid-cols-3">
			<div className="h-full py-6 pl-6 max-lg:hidden">
				<div className="relative inset-ring inset-ring-border grid h-full grid-rows-[1fr_auto] gap-32 rounded-2xl not-dark:bg-foreground/2 p-12">
					<div className="mx-auto flex max-w-xs flex-col justify-center space-y-6">
						<p className="font-copper-bt-regular text-3xl text-foreground">
							Turn Your Inbox and Calendar Into an AI Workspace
						</p>
						<p className="font-geist-sans">
							Manage meetings, organize emails, and automate follow-ups with
							Gmail and Calendar integration.
						</p>
					</div>
					<div className="mask-radial-from-35% mask-radial-[100%_100%] mask-radial-at-bottom absolute inset-0 mt-auto h-fit max-h-120 rounded-2xl opacity-20 dark:opacity-35">
						<Image
							alt="auth_background"
							className="size-full object-cover"
							decoding="async"
							height={426}
							priority
							src={"/assets/images/background_auth.webp"}
							width={640}
						/>
					</div>
				</div>
			</div>
			<div className="col-span-3 flex flex-col items-center justify-center p-6 lg:col-span-2">
				<div className="m-auto w-full max-w-xs text-center">{children}</div>
			</div>
		</div>
	);
};

export default layout;
