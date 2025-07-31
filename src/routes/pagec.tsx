import { AnimatedElement } from "@/lib/animated-mesh";
import {
	createFileRoute,
	useCanGoBack,
	useRouter,
} from "@tanstack/react-router";

export const Route = createFileRoute("/pagec")({
	component: RouteComponent,
});

function RouteComponent() {
	const canGoBack = useCanGoBack();
	const router = useRouter();

	const handleClick = () => {
		if (canGoBack) {
			router.history.back();
		} else {
			router.navigate({ to: "/" });
		}
	};

	return (
		<div className=" min-h-svh flex gap-4 flex-col justify-center items-center z-50 relative">
			<button
				type="button"
				onClick={handleClick}
				className="text-white hover:text-blue-500 underline"
			>
				Return
			</button>

			<AnimatedElement id="pagec-element" className="w-lg h-80" />
		</div>
	);
}
