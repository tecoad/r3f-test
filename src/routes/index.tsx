import { AnimatedElement } from "@/lib/animated-mesh";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="min-h-svh flex gap-4 flex-col justify-center items-center z-50 relative border border-red-500 h-[2000px]">
			<Link to="/pageb">
				<AnimatedElement
					id="shared-element"
					className="w-20 h-20 absolute top-[1000px] left-0"
				/>
			</Link>
		</div>
	);
}
