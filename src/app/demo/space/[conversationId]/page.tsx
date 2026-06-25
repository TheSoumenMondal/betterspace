import DemoAgentPage from "@/components/features/demo/demo-agent-page";

export default async function SpaceDemoConversationPage({
	params,
}: {
	params: Promise<{ conversationId: string }>;
}) {
	const { conversationId } = await params;
	return (
		<div className="h-full w-full">
			<DemoAgentPage conversationId={conversationId} />
		</div>
	);
}
