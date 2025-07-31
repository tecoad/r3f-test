import { AnimatedElement } from "@/lib/animated-mesh";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="min-h-svh flex gap-4 flex-col  z-50 relative border border-red-500 h-[2000px]">
			<span className="text-white mt-10 ml-10">
				Scroll down and click on the element
			</span>
			<Link to="/pageb">
				<AnimatedElement
					id="pageb-element"
					className="w-20 h-20 absolute top-[1000px] left-10 border border-green-500"
				/>
			</Link>
			<Link to="/pagec">
				<AnimatedElement
					id="pagec-element"
					className="w-20 h-20 absolute top-[1000px] left-52 border border-red-500"
				/>
			</Link>
		</div>
	);
}
