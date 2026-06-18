"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Message = {
	id: string;
	role: "user" | "ai";
	content: string;
};
export function ChatDemo() {
	const INITIAL_PROMPT =
		"Schedule a meeting with someone@gmail.com for 5:00 PM today and send them the calendar invite.";
	const [messages, setMessages] = useState<Message[]>([]);
	const [isTyping, setIsTyping] = useState(false);
	const [inputValue, setInputValue] = useState(INITIAL_PROMPT);
	const containerRef = useRef<HTMLDivElement>(null);
	const handleSend = () => {
		if (!inputValue.trim() || isTyping) return;
		const userMsg = inputValue;
		setMessages((prev) => [
			...prev,
			{ id: Date.now().toString(), role: "user", content: userMsg },
		]);
		setInputValue("");
		setIsTyping(true);
		if (messages.length === 0) {
			setTimeout(() => {
				setMessages((prev) => [
					...prev,
					{
						id: Date.now().toString(),
						role: "ai",
						content:
							"I have successfully created the email and sent it to the recipient. What else can I do for you?",
					},
				]);
				setIsTyping(false);
			}, 1500);
		} else {
			setTimeout(() => {
				setMessages((prev) => [
					...prev,
					{
						id: Date.now().toString(),
						role: "ai",
						content:
							"Hey, I think you are enjoying our platform! Please log in to get started and unlock all features.",
					},
				]);
				setIsTyping(false);
			}, 1500);
		}
	};
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: containerRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, []);
	return (
		<div className="flex h-full w-full flex-col items-center justify-end p-4 pb-0">
			<div className="flex h-[450px] w-full max-w-2xl flex-col justify-end gap-4">
				<div
					className="scrollbar-none mb-2 flex flex-col gap-4 overflow-y-auto pr-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
					ref={containerRef}
					style={{ maxHeight: "calc(100% - 80px)" }}
				>
					<AnimatePresence mode="popLayout">
						{messages.map((msg) => (
							<motion.div
								animate={{ opacity: 1, y: 0, scale: 1 }}
								className={`max-w-[85%] border px-3 py-2 font-geist-sans shadow-sm ${
									msg.role === "user"
										? "self-end rounded-2xl rounded-tr-sm bg-blue-600 text-white"
										: "self-start rounded-2xl rounded-tl-sm bg-white text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
								}`}
								initial={{ opacity: 0, y: 10, scale: 0.95 }}
								key={msg.id}
								transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
							>
								<p className="text-[15px] leading-relaxed">{msg.content}</p>
								{msg.role === "ai" &&
									messages.length > 2 &&
									msg === messages[messages.length - 1] && (
										<div className="mt-3 flex gap-3">
											<button
												className="rounded-full bg-blue-600 px-4 py-1.5 font-semibold text-white text-xs transition-colors hover:bg-blue-700"
												type="button"
											>
												Log In
											</button>
										</div>
									)}
							</motion.div>
						))}
						{isTyping && (
							<motion.div
								animate={{ opacity: 1, y: 0, scale: 1 }}
								className="self-start rounded-2xl rounded-tl-sm bg-white px-5 py-4 shadow-sm dark:bg-zinc-800"
								exit={{
									opacity: 0,
									scale: 0.95,
									transition: { duration: 0.2 },
								}}
								initial={{ opacity: 0, y: 10, scale: 0.95 }}
								key="typing"
								transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
							>
								<div className="flex items-center gap-1.5">
									<motion.div
										animate={{ y: [0, -4, 0] }}
										className="size-1.5 rounded-full bg-zinc-400"
										transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
									/>
									<motion.div
										animate={{ y: [0, -4, 0] }}
										className="size-1.5 rounded-full bg-zinc-400"
										transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
									/>
									<motion.div
										animate={{ y: [0, -4, 0] }}
										className="size-1.5 rounded-full bg-zinc-400"
										transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
									/>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<motion.div
					className={`flex w-full items-center gap-2 rounded-full bg-white py-2 pr-2 pl-5 shadow-lg ring-2 transition-colors duration-300 dark:bg-zinc-900 ${
						messages.length === 0
							? "ring-blue-500"
							: "ring-zinc-200 focus-within:ring-blue-400 dark:ring-zinc-800"
					}`}
					layout
				>
					<input
						className="flex-1 bg-transparent text-[15px] text-zinc-800 placeholder-zinc-400 focus:outline-none dark:text-zinc-100"
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSend();
							}
						}}
						placeholder="Type a message..."
						type="text"
						value={inputValue}
					/>
					<div className="flex items-center gap-1">
						<button
							className="flex size-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 focus:outline-none dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
							type="button"
						>
							<svg
								aria-hidden="true"
								className="size-4.5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
								/>
							</svg>
						</button>
						<button
							className={`flex size-8 items-center justify-center rounded-full text-white shadow-sm transition-all ${
								inputValue.trim() && !isTyping
									? "cursor-pointer bg-blue-600 hover:scale-105 hover:bg-blue-700"
									: "cursor-default bg-zinc-300 dark:bg-zinc-700"
							}`}
							disabled={!inputValue.trim() || isTyping}
							onClick={handleSend}
							type="button"
						>
							<svg
								aria-hidden="true"
								className="size-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M5 10l7-7m0 0l7 7m-7-7v18"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2.5}
								/>
							</svg>
						</button>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
