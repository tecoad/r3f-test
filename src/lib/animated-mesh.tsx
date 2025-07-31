import { useCanvas, useScrollRig, useTracker } from "@14islands/r3f-scroll-rig";
import {
	type ElementType,
	type MutableRefObject,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
} from "react";
import { Vector3 } from "three";

/**
 * ## Cross-Page Animated Mesh
 *
 * This utility creates a persistent 3D mesh that smoothly animates between
 * different DOM elements across page navigations, similar to Framer Motion's `layoutId`.
 *
 * ### How It Works
 *
 * 1.  **Global State (`window.sharedMeshState`):** A single object on the `window`
 *     stores the mesh's current `position` and `scale`. This state persists
 *     across page loads, acting as the single source of truth for the animation.
 *
 * 2.  **Persistent Mesh (`useCanvas`):** We use `r3f-scroll-rig`'s `useCanvas` hook
 *     with a shared `key` (`id`) and `dispose: false`. This ensures the same `mesh`
 *     instance is used across pages and never unmounted.
 *
 * 3.  **DOM-based Positioning:** Instead of relying on `useTracker`'s 3D coordinate
 *     system, we use `getBoundingClientRect()` to get the true pixel position and
 *     size of the tracked DOM element. This provides accurate coordinates regardless
 *     of scroll position or other layout shifts.
 *
 * 4.  **Animation Loop (`requestAnimationFrame`):** A `useEffect` hook starts an
 *     animation loop when the component mounts.
 *
 * 5.  **Interpolation (Lerp):** Inside the loop, we `lerp` (linearly interpolate)
 *     the global state's position and scale towards the target DOM element's
 *     current position and scale. This creates the smooth animation.
 *
 * 6.  **Render Trigger (`requestRender`):** On each frame of the animation, we call
 *     `useScrollRig().requestRender()` to ensure `r3f-scroll-rig` renders the
 *     updated mesh state.
 */

// --- 1. Global State ---
declare global {
	interface Window {
		sharedMeshState?: {
			// Using screen-space pixel coordinates for position and scale
			// ensures accuracy across different scroll positions and layouts.
			position: Vector3;
			scale: Vector3;
			animationId: number;
		};
	}
}

function getSharedMeshState() {
	if (!window.sharedMeshState) {
		window.sharedMeshState = {
			position: new Vector3(0, 0, 0),
			scale: new Vector3(1, 1, 1),
			animationId: 0,
		};
	}
	return window.sharedMeshState;
}

// --- 3. DOM-based Positioning ---
function getDOMState(element: HTMLElement) {
	const rect = element.getBoundingClientRect();

	// Center of the element in screen-space pixels,
	// converted to R3F's centered coordinate system.
	const position = new Vector3(
		rect.left + rect.width / 2 - window.innerWidth / 2,
		-(rect.top + rect.height / 2 - window.innerHeight / 2),
		0,
	);

	// Width and height of the element in pixels.
	const scale = new Vector3(rect.width, rect.height, 1);

	return { position, scale };
}

// The core component that handles the mesh and its animation
function AnimatedMesh({
	id,
	track,
	lerpFactor = 0.1,
	children,
}: AnimatedMeshProps) {
	// We use `useTracker` primarily to know when the element is in the viewport
	// and to trigger the useEffect when the tracked element changes on page navigation.
	const tracker = useTracker(track, {
		rootMargin: "50%",
		threshold: 0,
		autoUpdate: true,
	});

	const sharedState = getSharedMeshState();
	const { requestRender } = useScrollRig();

	// --- 2. Persistent Mesh ---
	const mesh = useCallback(
		(props: any) =>
			children || (
				<mesh {...props}>
					<planeGeometry args={[1, 1]} />
					<meshBasicMaterial color="blue" />
				</mesh>
			),
		[children],
	);

	const update = useCanvas(
		mesh,
		{
			position: [
				sharedState.position.x,
				sharedState.position.y,
				sharedState.position.z,
			],
			scale: [sharedState.scale.x, sharedState.scale.y, sharedState.scale.z],
			visible: tracker.inViewport,
		},
		{
			key: id,
			dispose: false,
		},
	);

	// --- 4. Animation Loop ---
	useEffect(() => {
		if (!update) return;

		// When this component mounts (e.g., on page navigation),
		// it starts a new animation loop.
		if (sharedState.animationId) {
			cancelAnimationFrame(sharedState.animationId);
		}

		const animate = () => {
			if (!track.current) return;

			const { position: targetPosition, scale: targetScale } = getDOMState(
				track.current,
			);

			// --- 5. Interpolation ---
			sharedState.position.lerp(targetPosition, lerpFactor);
			sharedState.scale.lerp(targetScale, lerpFactor);

			// Update the mesh with the new interpolated values
			update({
				position: [
					sharedState.position.x,
					sharedState.position.y,
					sharedState.position.z,
				],
				scale: [sharedState.scale.x, sharedState.scale.y, sharedState.scale.z],
				visible: tracker.inViewport,
			});

			// --- 6. Render Trigger ---
			requestRender();
			sharedState.animationId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			if (sharedState.animationId) {
				cancelAnimationFrame(sharedState.animationId);
				sharedState.animationId = 0;
			}
		};
	}, [
		tracker.inViewport,
		update,
		sharedState,
		lerpFactor,
		requestRender,
		track,
	]);

	return null;
}

// --- Prop and Helper Component Definitions ---
interface AnimatedMeshProps {
	id: string;
	track: MutableRefObject<HTMLElement>;
	lerpFactor?: number;
	children?: ReactNode;
}

interface AnimatedElementProps {
	id: string;
	lerpFactor?: number;
	meshChildren?: ReactNode;
	as?: ElementType;
	className?: string;
	style?: React.CSSProperties;
	children?: ReactNode;
	[key: string]: any;
}

/**
 * Simple wrapper that creates a DOM element and its corresponding 3D mesh
 * Usage: <AnimatedElement id="shared-element" className="w-52 h-52" />
 */
export function AnimatedElement({
	id,
	lerpFactor = 0.1,
	meshChildren,
	as: Component = "div",
	children,
	...props
}: AnimatedElementProps) {
	const trackRef = useRef<HTMLElement>(null!);

	return (
		<>
			{/* @ts-ignore */}
			<Component ref={trackRef} {...props}>
				{children}
			</Component>
			<AnimatedMesh id={id} track={trackRef} lerpFactor={lerpFactor}>
				{meshChildren}
			</AnimatedMesh>
		</>
	);
}
