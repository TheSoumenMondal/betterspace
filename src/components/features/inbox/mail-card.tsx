import { Badge } from "@/components/ui/badge";

type MailCardProps = {
	sender: string;
	subject: string;
	snippet: string;
	tags: string[];
	timestamp: string;
};

const MailCard = ({
	sender,
	subject,
	snippet,
	timestamp,
	tags,
}: MailCardProps) => {
	return (
		<div className="flex w-full max-w-xl flex-col">
			<div className="flex w-full justify-between">
				<div>
					<p>{sender}</p>
					<p>{subject}</p>
				</div>
				<div>{timestamp}</div>
			</div>
			<div>{snippet}</div>
			<div>
				{tags.map((tag) => (
					<Badge key={tag}>{tag}</Badge>
				))}
			</div>
		</div>
	);
};

export default MailCard;
