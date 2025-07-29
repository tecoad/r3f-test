import { PersistentScrollScene } from "@/routes";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";

export const Route = createFileRoute("/pageb")({
	component: RouteComponent,
});

function RouteComponent() {
	const track = useRef<HTMLDivElement>(null!);

	return (
		<div className=" min-h-svh flex gap-4 flex-col justify-center items-center z-50 relative">
			<Link to="/" className="text-white hover:text-blue-500 underline">
				Return
			</Link>

			<div ref={track} className="w-lg h-80 border border-white" />
			<PersistentScrollScene id="pageb" track={track} />
		</div>
	);
}
