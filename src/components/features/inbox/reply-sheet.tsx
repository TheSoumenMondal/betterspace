import { Bold, ImageIcon, Italic, List, Paperclip, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button-2";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/better-auth/client";
import { api } from "@/trpc/react";

interface ReplySheetProps {
	toEmail: string;
	toName: string;
	subject: string;
	threadId?: string;
	trigger: React.ReactNode;
}

export function ReplySheet({
	toEmail,
	toName,
	subject,
	threadId,
	trigger,
}: ReplySheetProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [replyBody, setReplyBody] = useState("");
	const { data: session } = authClient.useSession();

	const sendMailMutation = api.gmail.sendMail.useMutation({
		onSuccess: () => {
			toast.success("Reply sent successfully");
			setIsOpen(false);
			setReplyBody("");
		},
		onError: (error) => {
			toast.error(`Failed to send reply: ${error.message}`);
		},
	});

	const handleSendReply = () => {
		if (!replyBody.trim()) {
			toast.error("Please enter a reply");
			return;
		}

		sendMailMutation.mutate({
			sender: session?.user?.email ?? "",
			to: [toEmail],
			subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
			body: replyBody,
			threadId,
		});
	};

	const triggerElement = React.isValidElement(trigger) ? (
		React.cloneElement(
			trigger as React.ReactElement<{ onClick?: React.MouseEventHandler }>,
			{
				onClick: (e: React.MouseEvent) => {
					const el = trigger as React.ReactElement<{
						onClick?: React.MouseEventHandler;
					}>;
					if (el.props.onClick) {
						el.props.onClick(e);
					}
					setIsOpen(true);
				},
			},
		)
	) : (
		<button
			className="m-0 w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left outline-none"
			onClick={() => setIsOpen(true)}
			type="button"
		>
			{trigger}
		</button>
	);

	return (
		<>
			{triggerElement}
			{isOpen && (
				<button
					aria-label="Close reply sheet"
					className="absolute inset-0 z-40 m-0 h-full w-full cursor-default appearance-none border-0 bg-background/40 p-0 outline-none backdrop-blur-sm transition-opacity"
					onClick={() => setIsOpen(false)}
					type="button"
				/>
			)}

			<div
				className={cn(
					"absolute z-50 flex flex-col overflow-hidden border bg-card transition-all duration-300 ease-out",
					"right-0 bottom-0 left-0 max-h-[85vh] rounded-t-md sm:right-4 sm:bottom-4 sm:left-4 sm:rounded-lg",
					isOpen
						? "translate-y-0 opacity-100"
						: "pointer-events-none translate-y-12 opacity-0",
				)}
			>
				<div className="flex items-center justify-between border-b bg-muted/40 px-5 py-3">
					<div className="flex flex-col">
						<h3 className="font-semibold text-sm tracking-tight">
							Reply to {toName}
						</h3>
						<p className="text-muted-foreground text-xs">{toEmail}</p>
					</div>
					<Button
						className="h-7 w-7 rounded-full text-muted-foreground hover:bg-muted"
						onClick={() => setIsOpen(false)}
						size="icon-sm"
						variant="ghost"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>

				<div className="flex flex-1 flex-col overflow-y-auto p-5">
					<div className="relative pb-2">
						<Input
							aria-label="Subject"
							defaultValue={
								subject.startsWith("Re:") ? subject : `Re: ${subject}`
							}
							id="subject-input"
							placeholder="Subject"
							readOnly
						/>
					</div>

					<div className="relative flex min-h-62.5 flex-1 flex-col rounded-lg border p-2">
						<Textarea
							aria-label="Message"
							className="flex-1 resize-none border-0 bg-transparent p-0 text-base focus-visible:ring-0"
							id="message-input"
							onChange={(e) => setReplyBody(e.target.value)}
							placeholder="Write your reply..."
							value={replyBody}
						/>
					</div>
				</div>

				<div className="flex items-center justify-between border-t bg-muted/10 px-4 py-3">
					<div className="flex items-center gap-1">
						<Button
							className="h-8 w-8 text-muted-foreground hover:text-foreground"
							size="icon-sm"
							variant="ghost"
						>
							<Paperclip className="size-4" />
						</Button>
						<Button
							className="h-8 w-8 text-muted-foreground hover:text-foreground"
							size="icon-sm"
							variant="ghost"
						>
							<ImageIcon className="size-4" />
						</Button>
						<div className="mx-2 h-4 w-px bg-border" />
						<Button
							className="h-8 w-8 text-muted-foreground hover:text-foreground"
							size="icon-sm"
							variant="ghost"
						>
							<Bold className="size-4" />
						</Button>
						<Button
							className="h-8 w-8 text-muted-foreground hover:text-foreground"
							size="icon-sm"
							variant="ghost"
						>
							<Italic className="size-4" />
						</Button>
						<Button
							className="hidden h-8 w-8 text-muted-foreground hover:text-foreground sm:flex"
							size="icon-sm"
							variant="ghost"
						>
							<List className="size-4" />
						</Button>
					</div>
					<div className="flex items-center gap-3">
						<Button
							className="text-muted-foreground"
							onClick={() => setIsOpen(false)}
							variant="ghost"
						>
							Cancel
						</Button>
						<Button
							disabled={sendMailMutation.isPending}
							onClick={handleSendReply}
							variant="info"
						>
							{sendMailMutation.isPending ? "Sending..." : "Send Reply"}
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
