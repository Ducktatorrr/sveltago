<script lang="ts">
	import { page } from "$app/state";
	import { base } from "$app/paths";
	import "../app.css";

	let { children } = $props();

	// Helper function to check active path
	function isActivePath(target: string): boolean {
		// Normalize base path and compare
		const currentPath = page.url.pathname;
		if (
			// Checking for root path AND index.html as the widget is always loaded from index.html
			target === "/" &&
			(currentPath === `${base}/` || currentPath === `${base}/index.html`)
		) {
			return true;
		}
		return currentPath === `${base}${target}` || currentPath === target;
	}
</script>

<nav class="flex flex-row gap-2 m-1">
	<a
		class={`border border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 font-bold py-1 px-4 rounded ${
			isActivePath("/") ? "bg-blue-500 text-white" : "bg-none"
		}`}
		href="{base}/">Home</a
	>
	<a
		class={`border border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 font-bold py-1 px-4 rounded ${
			isActivePath("/test") ? "bg-blue-500 text-white" : "bg-none"
		}`}
		href="{base}/test">Test</a
	>
</nav>

{@render children()}
