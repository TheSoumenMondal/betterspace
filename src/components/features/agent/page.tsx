import { AudioWave01Icon } from "@/components/icons/audio-wave-01-icon";
import { SendIcon } from "@/components/icons/send-icon";
import { Button } from "@/components/ui/button-2";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { Textarea } from "@/components/ui/textarea";
import { getSession } from "@/server/better-auth/server";

const AgentPage = async () => {
	const session = await getSession();
	return (
		<div className="flex h-full w-full items-center justify-center px-4">
			<div className="flex w-full max-w-4xl flex-col gap-4 p-3 md:p-0">
				<DiaTextReveal
					className="font-copper-bt-regular text-4xl"
					text={[
						`How can I help you today, ${session?.user.name.split(" ")[0]}?`,
					]}
				/>
				<div className="relative w-full">
					<Textarea
						className="h-30 w-full resize-none rounded-xl p-4"
						placeholder="Check my meetings for today."
					/>
					<div className="absolute right-2 bottom-2 flex gap-2">
						<Button variant="muted">
							<AudioWave01Icon />
						</Button>
						<Button variant="muted">
							<SendIcon />
						</Button>
					</div>
				</div>
				<div className="flex justify-center">
					<p className="text-muted-foreground text-sm">
						Press Enter to send your message
					</p>
				</div>
			</div>
		</div>
	);
};

export default AgentPage;
