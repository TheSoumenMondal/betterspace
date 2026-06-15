"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import AgentAvatar from "@/components/icons/agent-avatar";
import { AudioWave01Icon } from "@/components/icons/audio-wave-01-icon";
import { SendIcon } from "@/components/icons/send-icon";
import { Button } from "@/components/ui/button-2";
import { Textarea } from "@/components/ui/textarea";
import { NavSlot } from "../sidebar/navslot-context";
import { useAgentsChat } from "./use-agents-chat";

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
					<span className="block truncate font-medium text-foreground text-sm">
						{title ?? "Conversation"}
					</span>
				</NavSlot>
			)}

			{(messages.length > 0 || isConversation) && (
				<div
					className={
						isConversation
							? "scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 py-8"
							: "scrollbar-thin max-h-[60vh] flex-1 overflow-y-auto px-4 pb-4"
					}
				>
					<div className="mx-auto w-full max-w-4xl space-y-6">
						{messages.map((m, index) => {
							const latestToolInvocation =
								m.toolInvocations?.[(m.toolInvocations?.length ?? 0) - 1];
							const isActiveAssistant =
								isLoading && index === messages.length - 1;

							if (m.role === "user") {
								return (
									<div className="flex justify-end" key={m.id}>
										<div className="max-w-[80%] rounded-2xl bg-zinc-800 px-4 py-3 text-white">
											{m.content}
										</div>
									</div>
								);
							}

							// Assistant Message
							return (
								<div className="flex gap-4 text-left" key={m.id}>
									<div className="mt-1 shrink-0">
										<AgentAvatar
											animated={isActiveAssistant || Boolean(m.activity)}
											className={
												isActiveAssistant
													? "shadow-[0_0_18px_rgba(236,72,153,0.35)]"
													: undefined
											}
											seed="betterspace-agent"
											size={32}
										/>
									</div>
									<div className="flex-1 space-y-3 pt-1">
										{m.activity && (
											<p className="animate-pulse text-muted-foreground text-xs">
												{m.activity}
											</p>
										)}

										{m.routedAgent &&
											m.routedAgent !== "Betterspace Router" && (
												<p className="text-muted-foreground text-xs">
													Handled by {m.routedAgent}
												</p>
											)}

										{/* Tool Invocations */}
										{latestToolInvocation && (
											<div
												className={`flex w-fit items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all ${
													latestToolInvocation.state === "result"
														? "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400"
														: "animate-pulse border-zinc-200 bg-white text-zinc-800 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
												}`}
												key={`${latestToolInvocation.toolCallId}-${latestToolInvocation.state}`}
											>
												{latestToolInvocation.state === "result" ? (
													<span className="text-emerald-500">✓</span>
												) : (
													<span className="size-3 animate-spin rounded-full border border-current border-t-transparent" />
												)}
												<span>
													{latestToolInvocation.state === "result"
														? "Finished"
														: "Running"}{" "}
													{formatToolName(latestToolInvocation.toolName)}
												</span>
											</div>
										)}

										{/* Text content */}
										{m.content && (
											<div className="text-zinc-900 leading-relaxed dark:text-zinc-100 [&_a]:text-blue-500 [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-border [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_h1]:mt-5 [&_h1]:mb-2 [&_h1]:font-semibold [&_h1]:text-2xl [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:font-semibold [&_h2]:text-xl [&_h3]:mt-3 [&_h3]:mb-2 [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:my-3 [&_ol]:list-decimal [&_p:last-child]:mb-0 [&_p]:mb-3 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_ul]:my-3 [&_ul]:list-disc">
												<ReactMarkdown>{m.content}</ReactMarkdown>
											</div>
										)}
									</div>
								</div>
							);
						})}
						<div ref={bottomRef} />
					</div>
				</div>
			)}

			{/* Input Area */}
			<div className={isConversation ? "shrink-0 px-4 pt-2 pb-3" : ""}>
				<form
					className="relative mx-auto w-full max-w-4xl"
					onSubmit={handleSubmit}
				>
					<Textarea
						className={
							isConversation
								? "h-20 min-h-20 w-full resize-none rounded-xl p-4"
								: "h-30 w-full resize-none rounded-xl p-4"
						}
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

				{!isConversation && (
					<div className="mt-4 flex justify-center">
						<p className="text-muted-foreground text-sm">
							Press Enter to send your message
						</p>
					</div>
				)}
				{isConversation && (
					<p className="mt-1 text-center text-muted-foreground text-xs">
						Press Enter to send, Shift + Enter for a new line
					</p>
				)}
			</div>
		</div>
	);
}
