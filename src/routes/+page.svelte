<script lang="ts">
	import { dev } from "$app/environment";
	import { mockTagoIO } from "$lib/mockTagoIO";

	let loadingText = $state("Loading...");
	let widgetData = $state<any>({});
	let realtimeData = $state<any[]>([]);

	$effect(() => {
		// Load some mock TagoIO data when running locally
		// See /src/lib/mockTagoIO.ts
		if (dev) {
			mockTagoIO();
		}

		// Initialize TagoIO
		if (window.TagoIO) {
			window.TagoIO.ready();

			// Load initial widget data
			window.TagoIO.onStart((widget) => {
				loadingText = "Module loaded!";
				widgetData = widget;
			});

			// Handle real-time updates
			window.TagoIO.onRealtime((data) => {
				loadingText = "Received real-time data";
				realtimeData = data;
			});
		} else {
			console.error("TagoIO library is not available.");
		}
	});

	// This wil only log the data to console in development
	$inspect("Widget data", widgetData);
	$inspect("Realtime data", realtimeData);
</script>

<h1 class="text-2xl mb-4">{loadingText}</h1>

<div class="flex flex-row gap-4">
	{#if realtimeData.length > 0}
		<div>
			<table class="border-collapse border border-blue-300">
				<thead class="bg-blue-100">
					<tr>
						<th
							class="border border-blue-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
							>Variable</th
						>
						<th
							class="border border-blue-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
							>Value</th
						>
						<th
							class="border border-blue-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
							>Time</th
						>
					</tr>
				</thead>
				<tbody>
					{#each realtimeData as data (data.id)}
						{#each data.result as result (result.id)}
							<tr class="hover:bg-blue-50">
								<td
									class="border border-blue-300 px-4 py-2 text-sm text-gray-600"
									>{result.variable}</td
								>
								<td
									class="border border-blue-300 px-4 py-2 text-sm text-gray-600"
									>{result.value} {result.unit}</td
								>
								<td
									class="border border-blue-300 px-4 py-2 text-sm text-gray-600"
									>{new Date(result.time).toLocaleString()}</td
								>
							</tr>
						{/each}
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
	<div>
		{#if widgetData}
			<div class="flex flex-row gap-2 items-center mb-4">
				<h2 class="text-xl mb-2">Widget data loaded</h2>
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
					onclick={() => console.log("widgetData", $state.snapshot(widgetData))}
					>Log widget data</button
				>
			</div>
		{/if}

		{#if realtimeData.length > 0}
			<div class="flex flex-row gap-2 items-center mb-4">
				<h2 class="text-xl">Real-time data loaded</h2>
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
					onclick={() =>
						console.log("realtimeData", $state.snapshot(realtimeData))}
					>Log real-time data</button
				>
			</div>
		{:else}
			<p>No real-time data received yet.</p>
		{/if}
	</div>
</div>
