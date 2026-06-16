export const GCAL_COLOURS: Record<
	string,
	{ pill: string; dot: string; lightBg: string }
> = {
	"1": {
		pill: "bg-[#a4bdfc]/80 text-[#1a1a1a] dark:text-[#1a1a1a]",
		dot: "bg-[#a4bdfc]",
		lightBg: "bg-[#a4bdfc]/[0.05] dark:bg-[#a4bdfc]/[0.08]",
	},
	"2": {
		pill: "bg-[#7ae7bf]/80 text-[#1a1a1a] dark:text-[#1a1a1a]",
		dot: "bg-[#7ae7bf]",
		lightBg: "bg-[#7ae7bf]/[0.05] dark:bg-[#7ae7bf]/[0.08]",
	},
	"3": {
		pill: "bg-[#dbadff]/80 text-[#1a1a1a] dark:text-[#1a1a1a]",
		dot: "bg-[#dbadff]",
		lightBg: "bg-[#dbadff]/[0.05] dark:bg-[#dbadff]/[0.08]",
	},
	"4": {
		pill: "bg-[#ff887c]/80 text-[#1a1a1a] dark:text-[#1a1a1a]",
		dot: "bg-[#ff887c]",
		lightBg: "bg-[#ff887c]/[0.05] dark:bg-[#ff887c]/[0.08]",
	},
	"5": {
		pill: "bg-[#fbd75b]/80 text-[#1a1a1a] dark:text-[#1a1a1a]",
		dot: "bg-[#fbd75b]",
		lightBg: "bg-[#fbd75b]/[0.05] dark:bg-[#fbd75b]/[0.08]",
	},
	"6": {
		pill: "bg-[#ffb878]/80 text-[#1a1a1a] dark:text-[#1a1a1a]",
		dot: "bg-[#ffb878]",
		lightBg: "bg-[#ffb878]/[0.05] dark:bg-[#ffb878]/[0.08]",
	},
	"7": {
		pill: "bg-[#46d6db]/80 text-[#1a1a1a] dark:text-[#1a1a1a]",
		dot: "bg-[#46d6db]",
		lightBg: "bg-[#46d6db]/[0.05] dark:bg-[#46d6db]/[0.08]",
	},
	"8": {
		pill: "bg-[#e1e1e1]/80 text-[#1a1a1a]",
		dot: "bg-[#e1e1e1]",
		lightBg: "bg-[#e1e1e1]/[0.05] dark:bg-[#e1e1e1]/[0.08]",
	},
	"9": {
		pill: "bg-[#5484ed] text-white",
		dot: "bg-[#5484ed]",
		lightBg: "bg-[#5484ed]/[0.05] dark:bg-[#5484ed]/[0.08]",
	},
	"10": {
		pill: "bg-[#51b749] text-white",
		dot: "bg-[#51b749]",
		lightBg: "bg-[#51b749]/[0.05] dark:bg-[#51b749]/[0.08]",
	},
	"11": {
		pill: "bg-[#dc2127] text-white",
		dot: "bg-[#dc2127]",
		lightBg: "bg-[#dc2127]/[0.05] dark:bg-[#dc2127]/[0.08]",
	},
};

export const FALLBACK: { pill: string; dot: string; lightBg: string }[] = [
	{
		pill: "bg-violet-500/80 text-white",
		dot: "bg-violet-500",
		lightBg: "bg-violet-500/[0.05] dark:bg-violet-500/[0.08]",
	},
	{
		pill: "bg-blue-500/80 text-white",
		dot: "bg-blue-500",
		lightBg: "bg-blue-500/[0.05] dark:bg-blue-500/[0.08]",
	},
	{
		pill: "bg-emerald-500/80 text-white",
		dot: "bg-emerald-500",
		lightBg: "bg-emerald-500/[0.05] dark:bg-emerald-500/[0.08]",
	},
	{
		pill: "bg-amber-500/80 text-white",
		dot: "bg-amber-500",
		lightBg: "bg-amber-500/[0.05] dark:bg-amber-500/[0.08]",
	},
	{
		pill: "bg-rose-500/80 text-white",
		dot: "bg-rose-500",
		lightBg: "bg-rose-500/[0.05] dark:bg-rose-500/[0.08]",
	},
	{
		pill: "bg-cyan-500/80 text-white",
		dot: "bg-cyan-500",
		lightBg: "bg-cyan-500/[0.05] dark:bg-cyan-500/[0.08]",
	},
];

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
