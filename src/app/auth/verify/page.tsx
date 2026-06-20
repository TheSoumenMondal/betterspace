import { Suspense } from "react";
import VerifyEmailPageComponent from "@/components/features/auth/verify";

const page = () => {
	return (
		<div className="h-full w-full">
			<Suspense>
				<VerifyEmailPageComponent />
			</Suspense>
		</div>
	);
};

export default page;
