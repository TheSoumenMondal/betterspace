import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/trpc/react";

export type Role = "user" | "assistant";

export interface ToolInvocation {
	toolCallId: string;
	toolName: string;
	args: Record<string, unknown>;
	state: "call" | "result";
	result?: string;
}

export interface Message {
	id: string;
	role: Role;
	content: string;
	activity?: string;
	routedAgent?: string;
	toolInvocations?: ToolInvocation[];
}

type RunInput = {
	conversationId: string;
	message: string;
	userMessagePersisted: boolean;
};

const pendingRunKey = (conversationId: string) =>
	`betterspace:pending-agent-run:${conversationId}`;

export function useAgentsChat(conversationId?: string) {
	const router = useRouter();
	const [messages, setMessages] = useState<Message[]>([]);
	const [title, setTitle] = useState<string>();
	const [input, setInput] = useState("");
	const [runInput, setRunInput] = useState<RunInput>();
	const activeAssistantId = useRef<string | undefined>(undefined);
	const hydratedConversationId = useRef<string | undefined>(undefined);

	const conversation = api.agentChat.byId.useQuery(
		{ conversationId: conversationId ?? crypto.randomUUID() },
		{
			enabled: Boolean(conversationId),
			refetchOnWindowFocus: false,
		},
	);
	const createConversation = api.agentChat.create.useMutation();

	const updateActiveAssistant = useCallback(
		(updater: (message: Message) => Message) => {
			const assistantId = activeAssistantId.current;
			if (!assistantId) return;

			setMessages((previous) =>
				previous.map((message) =>
					message.id === assistantId ? updater(message) : message,
				),
			);
		},
		[],
	);

	api.agentChat.run.useSubscription(
		runInput ?? {
			conversationId: conversationId ?? "00000000-0000-0000-0000-000000000000",
			message: "Waiting",
			userMessagePersisted: false,
		},
		{
			enabled: Boolean(runInput),
			onData: (event) => {
				if (event.type === "title") {
					setTitle(event.title);
				}

				if (event.type === "status") {
					updateActiveAssistant((message) => ({
						...message,
						activity: event.message,
					}));
				}

				if (event.type === "agent") {
					updateActiveAssistant((message) => ({
						...message,
						routedAgent: event.agent,
						activity:
							event.agent === "Betterspace Router"
								? "Router is deciding what to do"
								: `${event.agent} is working on your request`,
					}));
				}

				if (event.type === "tool_call") {
					updateActiveAssistant((message) => ({
						...message,
						activity: `Running ${event.toolName}`,
						toolInvocations: [
							...(message.toolInvocations ?? []).filter(
								(tool) => tool.toolCallId !== event.toolCallId,
							),
							{
								toolCallId: event.toolCallId,
								toolName: event.toolName,
								args: event.args,
								state: "call",
							},
						],
					}));
				}

				if (event.type === "tool_result") {
					updateActiveAssistant((message) => ({
						...message,
						activity: "Preparing the response",
						toolInvocations: message.toolInvocations?.map((tool) =>
							tool.toolCallId === event.toolCallId
								? { ...tool, state: "result", result: event.result }
								: tool,
						),
					}));
				}

				if (event.type === "text_delta") {
					updateActiveAssistant((message) => ({
						...message,
						activity: "Writing response",
						content: message.content + event.delta,
					}));
				}

				if (event.type === "done") {
					updateActiveAssistant((message) => ({
						...message,
						...event.message,
						activity: undefined,
					}));
					setRunInput(undefined);
				}

				if (event.type === "error") {
					updateActiveAssistant((message) => ({
						...message,
						activity: undefined,
						content: message.content || `Error: ${event.message}`,
					}));
					setRunInput(undefined);
				}
			},
			onError: (error) => {
				updateActiveAssistant((message) => ({
					...message,
					activity: undefined,
					content: message.content || `Error: ${error.message}`,
				}));
				setRunInput(undefined);
			},
		},
	);

	useEffect(() => {
		if (
			!conversationId ||
			!conversation.data ||
			hydratedConversationId.current === conversationId
		) {
			return;
		}

		hydratedConversationId.current = conversationId;
		setTitle(conversation.data.title ?? "Conversation");

		const pendingMessage = sessionStorage.getItem(
			pendingRunKey(conversationId),
		);
		if (!pendingMessage) {
			setMessages(conversation.data.messages);
			return;
		}

		sessionStorage.removeItem(pendingRunKey(conversationId));
		const assistantId = crypto.randomUUID();
		activeAssistantId.current = assistantId;
		setMessages([
			...conversation.data.messages,
			{
				id: assistantId,
				role: "assistant",
				content: "",
				activity: "Starting router",
				toolInvocations: [],
			},
		]);
		setRunInput({
			conversationId,
			message: pendingMessage,
			userMessagePersisted: true,
		});
	}, [conversation.data, conversationId]);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
			setInput(e.target.value);
		},
		[],
	);

	const handleSubmit = useCallback(
		async (e?: React.FormEvent<HTMLFormElement>) => {
			e?.preventDefault();
			const content = input.trim();
			if (!content || runInput || createConversation.isPending) return;

			setInput("");

			if (!conversationId) {
				try {
					const created = await createConversation.mutateAsync({
						message: content,
					});
					sessionStorage.setItem(
						pendingRunKey(created.conversationId),
						content,
					);
					router.push(`/space/${created.conversationId}`);
				} catch (error) {
					setMessages([
						{
							id: crypto.randomUUID(),
							role: "assistant",
							content: `Error: ${
								error instanceof Error
									? error.message
									: "Could not create conversation"
							}`,
						},
					]);
				}
				return;
			}

			const assistantId = crypto.randomUUID();
			activeAssistantId.current = assistantId;
			setMessages((previous) => [
				...previous,
				{ id: crypto.randomUUID(), role: "user", content },
				{
					id: assistantId,
					role: "assistant",
					content: "",
					activity: "Starting router",
					toolInvocations: [],
				},
			]);
			setRunInput({
				conversationId,
				message: content,
				userMessagePersisted: false,
			});
		},
		[conversationId, createConversation, input, router, runInput],
	);

	return {
		messages,
		title,
		input,
		handleInputChange,
		handleSubmit,
		isLoading:
			Boolean(runInput) ||
			createConversation.isPending ||
			(Boolean(conversationId) && conversation.isLoading),
	};
}
