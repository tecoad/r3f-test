import { GlobalCanvas, SmoothScrollbar } from "@14islands/r3f-scroll-rig";
import { createRootRoute, Outlet } from "@tanstack/react-router";

const Root = () => {
	return (
		<>
			<GlobalCanvas />
			<SmoothScrollbar enabled={false} />
			<Outlet />
		</>
	);
};

export const Route = createRootRoute({
	component: Root,
});
