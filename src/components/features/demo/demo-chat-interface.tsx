"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import AgentAvatar from "@/components/icons/agent-avatar";
import { SendIcon } from "@/components/icons/send-icon";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button-2";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { NavSlot } from "../sidebar/navslot-context";

type Message = {
	id: string;
	role: "user" | "assistant";
	content: string;
	status?: string;
};

const SUGGESTIONS = [
	{
		label: "Summarize my unread emails",
		prompt: "Can you summarize my unread emails?",
		response:
			"Here is a summary of your unread emails:\n\n- **Project Update**: The Q3 deliverables are on track.\n- **Invoice**: You have a new invoice for last month's services.\n- **Security**: There's an important security update requiring your attention.\n\nWould you like me to draft replies to any of these?",
		status: "Finished Gmail summary tool",
	},
	{
		label: "What meetings do I have today?",
		prompt: "What meetings do I have today?",
		response:
			"You have the following meetings scheduled for today:\n\n1. **Sync with Design** at 10:00 AM\n2. **1:1 with Manager** at 2:00 PM\n3. **Client Call** at 4:30 PM\n\nI can help you prepare for any of these if you'd like.",
		status: "Finished Google Calendar tool",
	},
	{
		label: "Draft a polite decline to the product launch",
		prompt: "Draft a polite decline to the product launch invitation.",
		response:
			"I've drafted a response to the product launch invitation:\n\n> Hi there,\n> \n> Thank you so much for the invitation to the exclusive product launch event. Unfortunately, I have a conflicting commitment and won't be able to attend. \n> \n> Wishing you a very successful launch!\n\nShould I send this?",
		status: "Finished Gmail draft tool",
	},
];

function DemoChatInterfaceInner({
	conversationId,
}: {
	conversationId?: string;
}) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentStatus, setCurrentStatus] = useState<string | null>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	const isConversation = Boolean(conversationId);
	const router = useRouter();
	const searchParams = useSearchParams();
	const hasInitialized = useRef(false);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: simulateResponse is not stable but is safe to use here
	useEffect(() => {
		const promptFromUrl = searchParams.get("prompt");
		if (
			isConversation &&
			promptFromUrl &&
			messages.length === 0 &&
			!isLoading &&
			!hasInitialized.current
		) {
			hasInitialized.current = true;
			const s = SUGGESTIONS.find((s) => s.prompt === promptFromUrl) || {
				prompt: promptFromUrl,
				response: "I've processed your request successfully.",
				status: "Finished Request",
			};
			simulateResponse(s.prompt, s.response, s.status);
		}
	}, [isConversation, searchParams, messages.length, isLoading]);

	const simulateResponse = (
		prompt: string,
		response: string,
		statusText: string,
	) => {
		setMessages((prev) => [
			...prev,
			{ id: Date.now().toString(), role: "user", content: prompt },
		]);
		setInput("");
		setIsLoading(true);

		setTimeout(() => {
			setCurrentStatus(`Running Agent Router`);
			setTimeout(() => {
				setCurrentStatus(`Running ${statusText.replace("Finished ", "")}`);
				setTimeout(() => {
					setCurrentStatus(statusText);
					setTimeout(() => {
						setCurrentStatus(null);
						setMessages((prev) => [
							...prev,
							{
								id: (Date.now() + 1).toString(),
								role: "assistant",
								content: response,
							},
						]);
						setIsLoading(false);
					}, 500);
				}, 1000);
			}, 800);
		}, 300);
	};

	const handleSubmit = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!input.trim() || isLoading) return;

		if (!isConversation) {
			router.push(
				`/demo/space/${Date.now()}?prompt=${encodeURIComponent(input)}`,
			);
			return;
		}

		simulateResponse(
			input,
			"Since this is a demo environment, I'm currently running in a restricted sandbox mode. You can try clicking one of the suggested prompts above to see how I typically operate!",
			"Finished Demo Mode Check",
		);
	};

	return (
		<div
			className={
				isConversation
					? "flex h-full min-h-0 w-full flex-col"
					: "flex w-full flex-col gap-4"
			}
		>
			{conversationId && (
				<NavSlot>
					<span className="block truncate font-geist-mono font-semibold text-foreground text-xs uppercase">
						Demo Conversation
					</span>
				</NavSlot>
			)}

			{(messages.length > 0 || isConversation) && (
				<div
					className={
						isConversation
							? "scrollbar-none min-h-0 flex-1 overflow-y-auto px-4 pt-8"
							: "scrollbar-none max-h-[60vh] flex-1 overflow-y-auto px-4"
					}
				>
					<div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
						{messages.map((m, index) => {
							const _isActiveAssistant =
								isLoading && index === messages.length - 1;

							if (m.role === "user") {
								return (
									<div className="flex justify-end" key={m.id}>
										<div
											className={cn(
												buttonVariants({ variant: "info", animation: "none" }),
												"h-auto max-w-[80%] cursor-text select-text whitespace-normal text-wrap rounded-xl px-3 py-2 text-left font-geist-sans text-sm hover:brightness-100 active:brightness-100",
											)}
										>
											{m.content}
										</div>
									</div>
								);
							}

							return (
								<div className="flex gap-4 text-left" key={m.id}>
									<div className="mt-1 shrink-0">
										<AgentAvatar
											animated={false}
											seed="betterspace-agent"
											size={24}
										/>
									</div>
									<div className="flex-1 flex-col">
										{m.content && (
											<div className="max-w-fit rounded-2xl border border-dashed bg-accent/50 px-3 py-3 text-sm [&_a]:text-blue-500 [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-border [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_h1]:mt-5 [&_h1]:mb-2 [&_h1]:font-semibold [&_h1]:text-2xl [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:font-semibold [&_h2]:text-xl [&_h3]:mt-3 [&_h3]:mb-2 [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:my-3 [&_ol]:list-decimal [&_p:last-child]:mb-0 [&_p]:mb-3 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_ul]:my-3 [&_ul]:list-disc">
												<ReactMarkdown>{m.content}</ReactMarkdown>
											</div>
										)}
									</div>
								</div>
							);
						})}

						{isLoading && (
							<div className="flex items-center gap-4 text-left">
								<div className="shrink-0">
									<AgentAvatar
										animated={true}
										className="shadow-[0_0_18px_rgba(236,72,153,0.35)]"
										seed="betterspace-agent"
										size={24}
									/>
								</div>
								<div className="flex-1">
									<AnimatePresence>
										{currentStatus && (
											<motion.div
												animate={{
													opacity: 1,
													height: "auto",
												}}
												className="flex items-center overflow-hidden text-muted-foreground text-xs"
												exit={{ opacity: 0, height: 0 }}
												initial={{ opacity: 0, height: 0 }}
												key={currentStatus}
												transition={{ duration: 0.2 }}
											>
												{currentStatus}
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>
						)}
					</div>
					<div className="h-4 shrink-0" ref={bottomRef} />
				</div>
			)}

			<div className={isConversation ? "shrink-0 px-4 pb-3" : ""}>
				{isConversation ? (
					<div className="relative mx-auto w-full max-w-4xl">
						<form className="relative w-full" onSubmit={handleSubmit}>
							<Textarea
								className="h-20 min-h-20 w-full resize-none rounded-xl p-4"
								disabled={isLoading}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleSubmit();
									}
								}}
								placeholder="Check my meetings for today, or draft an email..."
								value={input}
							/>
							<div className="absolute right-2 bottom-2 flex gap-2">
								<Button disabled={isLoading} type="submit" variant="muted">
									<SendIcon />
								</Button>
							</div>
						</form>
					</div>
				) : (
					<div className="relative mx-auto w-full max-w-4xl">
						<div className="absolute -inset-1 z-0 rounded-[2rem] bg-linear-to-br from-cyan-400 via-fuchsia-500 to-orange-500 opacity-20 blur-2xl" />
						<form
							className="relative z-10 w-full rounded-2xl border bg-background shadow-xl"
							onSubmit={handleSubmit}
						>
							<Textarea
								className="h-30 w-full resize-none rounded-2xl border-none bg-transparent p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
								disabled={isLoading}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleSubmit();
									}
								}}
								placeholder="Check my meetings for today, or draft an email..."
								value={input}
							/>
							<div className="absolute right-2 bottom-2 flex gap-2">
								<Button disabled={isLoading} type="submit" variant="muted">
									<SendIcon />
								</Button>
							</div>
						</form>
					</div>
				)}
				<div className="relative mx-auto mt-4 flex w-full max-w-4xl flex-wrap justify-center gap-2">
					{SUGGESTIONS.map((s) => (
						<Badge
							className="cursor-pointer border-transparent bg-accent/10 px-3 py-1.5 hover:bg-accent/50"
							key={s.label}
							onClick={() => {
								if (isLoading) return;
								if (!isConversation) {
									router.push(
										`/demo/space/${Date.now()}?prompt=${encodeURIComponent(s.prompt)}`,
									);
								} else {
									simulateResponse(s.prompt, s.response, s.status);
								}
							}}
							variant="secondary"
						>
							{s.label}
						</Badge>
					))}
				</div>

				{!isConversation && (
					<div className="mt-4 flex justify-center">
						<p className="text-muted-foreground text-sm">
							Press Enter to send your message
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export function DemoChatInterface(props: { conversationId?: string }) {
	return (
		<Suspense
			fallback={
				<div className="flex h-full w-full items-center justify-center">
					<Spinner />
				</div>
			}
		>
			<DemoChatInterfaceInner {...props} />
		</Suspense>
	);
}
