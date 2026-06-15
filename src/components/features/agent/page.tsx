import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { getSession } from "@/server/better-auth/server";
import { ChatInterface } from "./chat-interface";

const AgentPage = async ({ conversationId }: { conversationId?: string }) => {
	const session = await getSession();

	if (conversationId) {
		return (
			<div className="h-full min-h-0 w-full">
				<ChatInterface conversationId={conversationId} />
			</div>
		);
	}

	return (
		<div className="flex h-full w-full items-center justify-center px-4">
			<div className="flex w-full max-w-4xl flex-col gap-4 p-3 md:p-0">
				<DiaTextReveal
					className="font-copper-bt-regular text-4xl"
					text={[
						`How can I help you today, ${session?.user.name.split(" ")[0]}?`,
					]}
				/>
				<ChatInterface conversationId={conversationId} />
			</div>
		</div>
	);
};

export default AgentPage;
