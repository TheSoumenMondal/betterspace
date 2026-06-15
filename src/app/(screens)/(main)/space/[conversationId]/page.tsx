import AgentPage from "@/components/features/agent/page";

const page = async ({
	params,
}: {
	params: Promise<{ conversationId: string }>;
}) => {
	const { conversationId } = await params;

	return (
		<div className="h-full w-full">
			<AgentPage conversationId={conversationId} />
		</div>
	);
};

export default page;
