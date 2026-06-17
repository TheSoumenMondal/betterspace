"use client";

import {
	Mail01Icon,
	PencilEdit01Icon,
	SentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button-2";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogPopup,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/server/better-auth/client";
import { api } from "@/trpc/react";

export function ComposeDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { data: session } = authClient.useSession();
	const [to, setTo] = useState("");
	const [subject, setSubject] = useState("");
	const [body, setBody] = useState("");

	const sendMail = api.gmail.sendMail.useMutation({
		onSuccess: () => {
			toast.success("Email sent successfully!");
			onOpenChange(false);
			setTo("");
			setSubject("");
			setBody("");
		},
		onError: (error) => {
			toast.error(`Failed to send email: ${error.message}`);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!to || !subject || !body) {
			toast.error("Please fill in all fields");
			return;
		}

		if (!session?.user?.email) {
			toast.error("You must be logged in to send emails");
			return;
		}

		sendMail.mutate({
			sender: session.user.email,
			to: [to.trim()],
			subject,
			body,
			isHtml: false,
		});
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogPopup animationPreset="none" className="sm:max-w-150">
				<DialogHeader>
					<DialogTitle className="font-copper-bt-regular text-2xl">
						Compose Email
					</DialogTitle>
					<DialogDescription>Draft and send a new message</DialogDescription>
				</DialogHeader>
				<form className="flex flex-col gap-4 py-4" onSubmit={handleSubmit}>
					<div className="flex flex-col gap-2">
						<Label htmlFor="to">To</Label>
						<InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:ring-0">
							<InputGroupAddon>
								<HugeiconsIcon icon={Mail01Icon} size={16} />
							</InputGroupAddon>
							<InputGroupInput
								id="to"
								onChange={(e) => setTo(e.target.value)}
								placeholder="example@example.com"
								value={to}
							/>
						</InputGroup>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="subject">Subject</Label>
						<InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:ring-0">
							<InputGroupAddon>
								<HugeiconsIcon icon={PencilEdit01Icon} size={16} />
							</InputGroupAddon>
							<InputGroupInput
								id="subject"
								onChange={(e) => setSubject(e.target.value)}
								placeholder="Email subject"
								value={subject}
							/>
						</InputGroup>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="body">Message</Label>
						<Textarea
							className="max-h-75 min-h-50 overflow-y-auto"
							id="body"
							onChange={(e) => setBody(e.target.value)}
							placeholder="Write your message here..."
							value={body}
						/>
					</div>
					<div className="flex justify-end gap-2 pt-4">
						<Button
							disabled={sendMail.isPending}
							onClick={() => onOpenChange(false)}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
						<Button disabled={sendMail.isPending} type="submit" variant="info">
							{sendMail.isPending ? (
								"Sending..."
							) : (
								<>
									<HugeiconsIcon className="mr-1" icon={SentIcon} size={16} />
									Send
								</>
							)}
						</Button>
					</div>
				</form>
			</DialogPopup>
		</Dialog>
	);
}
