import { Skeleton } from "@/components/ui/skeleton";

export function StatsChip({
	label,
	value,
	isLoading,
}: {
	label: string;
	value: number;
	isLoading: boolean;
}) {
	if (isLoading) return <Skeleton className="h-4 w-16" />;
	return (
		<span className="flex items-center gap-1 text-muted-foreground text-xs">
			<span className="font-semibold text-foreground">{value}</span>
			{label}
		</span>
	);
}
