import { ScrollScene, UseCanvas } from "@14islands/r3f-scroll-rig";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { RefObject } from "react";
import { useRef } from "react";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const track = useRef<HTMLDivElement>(null!);

	return (
		<div className="min-h-svh flex gap-4 flex-col justify-center items-center z-50 relative">
			<div />
			<Link to="/pageb">
				<div ref={track} className="w-52 h-52 border border-white" />
				<PersistentScrollScene id="pageb" track={track} />
			</Link>
		</div>
	);
}

export function PersistentScrollScene({
	id,
	track,
}: {
	id: string;
	track: RefObject<HTMLElement>;
}) {
	return (
		// Id: when added blue mesh does not appear
		<UseCanvas dispose={false}>
			<ScrollScene track={track}>
				{(props) => (
					<mesh {...props}>
						<planeGeometry />
						<meshBasicMaterial color="blue" />
					</mesh>
				)}
			</ScrollScene>
		</UseCanvas>
	);
}
