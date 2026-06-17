"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import AgentAvatar from "@/components/icons/agent-avatar";
import { AudioWave01Icon } from "@/components/icons/audio-wave-01-icon";
import { SendIcon } from "@/components/icons/send-icon";
import { Button, buttonVariants } from "@/components/ui/button-2";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { NavSlot } from "../sidebar/navslot-context";
import { type Message, useAgentsChat } from "./use-agents-chat";

function formatToolName(toolName: string) {
	return toolName
		.split(/[._-]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function ChatInterface({ conversationId }: { conversationId?: string }) {
	const { messages, title, input, handleInputChange, handleSubmit, isLoading } =
		useAgentsChat(conversationId);
	const isConversation = Boolean(conversationId);
	const bottomRef = useRef<HTMLDivElement>(null);

	const getMessageStatus = (m: Message): string | null => {
		if (m.toolInvocations?.length) {
			const latest = m.toolInvocations[m.toolInvocations.length - 1];
			if (!latest) return null;
			if (latest.state === "result") {
				return `Finished ${formatToolName(latest.toolName)}`;
			} else {
				return `Running ${formatToolName(latest.toolName)}`;
			}
		}

		if (m.routedAgent && m.routedAgent !== "Betterspace Router") {
			return `Handled by ${m.routedAgent}`;
		}

		if (m.activity) {
			return m.activity;
		}

		return null;
	};

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
	});

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
						{title ?? "Conversation"}
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
							const isActiveAssistant =
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

							const currentStatus = getMessageStatus(m);

							return (
								<div className="flex gap-4 text-left" key={m.id}>
									<div className="mt-1 shrink-0">
										<AgentAvatar
											animated={true}
											className={
												isActiveAssistant
													? "shadow-[0_0_18px_rgba(236,72,153,0.35)]"
													: undefined
											}
											seed="betterspace-agent"
											size={24}
										/>
									</div>
									<div className="flex-1 flex-col">
										<AnimatePresence>
											{currentStatus && (
												<motion.div
													animate={{
														opacity: 1,
														height: m.content ? "auto" : 24,
														marginBottom: m.content ? 8 : 0,
														marginTop: m.content ? 0 : 4,
													}}
													className="flex items-center overflow-hidden text-muted-foreground text-xs"
													exit={{
														opacity: 0,
														height: 0,
														marginBottom: 0,
														marginTop: 0,
													}}
													initial={{
														opacity: 0,
														height: 0,
														marginBottom: 0,
														marginTop: 0,
													}}
													key={currentStatus}
													transition={{ duration: 0.2 }}
												>
													<motion.span
														animate={{ y: 0 }}
														exit={{ y: -5 }}
														initial={{ y: 5 }}
														transition={{ duration: 0.2 }}
													>
														{currentStatus}
													</motion.span>
												</motion.div>
											)}
										</AnimatePresence>

										{m.content && (
											<div className="max-w-fit rounded-2xl border border-dashed bg-accent/50 px-3 py-3 text-sm [&_a]:text-blue-500 [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-border [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_h1]:mt-5 [&_h1]:mb-2 [&_h1]:font-semibold [&_h1]:text-2xl [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:font-semibold [&_h2]:text-xl [&_h3]:mt-3 [&_h3]:mb-2 [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:my-3 [&_ol]:list-decimal [&_p:last-child]:mb-0 [&_p]:mb-3 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_ul]:my-3 [&_ul]:list-disc">
												<ReactMarkdown>{m.content}</ReactMarkdown>
											</div>
										)}
									</div>
								</div>
							);
						})}
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
								onChange={handleInputChange}
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
								<Button type="button" variant="muted">
									<AudioWave01Icon />
								</Button>
								<Button type="submit" variant="muted">
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
								onChange={handleInputChange}
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
								<Button type="button" variant="muted">
									<AudioWave01Icon />
								</Button>
								<Button type="submit" variant="muted">
									<SendIcon />
								</Button>
							</div>
						</form>
					</div>
				)}

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
