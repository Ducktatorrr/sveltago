<script lang="ts">
	import { dev } from "$app/environment";
	import { browser } from "$app/environment";
	import { mockTagoIO } from "$lib/mockTagoIO";

	import {
		TAGO_USER_INFO_URL,
		API_URL,
		TOKEN_STORAGE_KEY,
		fetchTagoUserInfo,
		fetchApiToken,
		getValidApiToken,
		fetchDevices,
		isTokenValid,
		type Device,
		type TagoUserInfoApi,
	} from "$lib/api";

	// Reactive state
	let loadingText = $state("Loading...");
	let widgetData = $state<Widget | null>(null);
	let widgetUserData = $state<TUserInformation | null>(null);
	let realtimeData = $state<WidgetVariableData[]>([]);
	let userInfo = $state<(TagoUserInfoApi & { token: string }) | null>(null);
	let apiToken = $state<string | null>(null);
	let devices = $state<Device[]>([]);
	let isInitializing = $state(false);

	/**
	 * Initializes the application data flow
	 */

	async function initializeUserData(tagoUserData: TUserInformation | null) {
		if (!tagoUserData?.token) {
			loadingText = "No TagoIO token available";
			return;
		}

		// Prevent multiple initialization at once
		if (isInitializing) return;
		isInitializing = true;

		loadingText = "Fetching user information...";

		try {
			// 1. Get user info from TagoIO
			const tagoUserInfo = await fetchTagoUserInfo(tagoUserData.token);
			if (!tagoUserInfo) {
				loadingText = "Failed to fetch TagoIO user info";
				isInitializing = false;
				return;
			}

			// 2. Merge TagoIO user info with token
			userInfo = { ...tagoUserInfo, token: tagoUserData.token };

			// 3. Get our API token
			const token = await getValidApiToken(userInfo);
			if (!token) {
				loadingText = "Failed to get API token";
				isInitializing = false;
				return;
			}

			// Set apiToken first - we'll fetch devices in the effect
			apiToken = token;
			loadingText = "Authentication successful";
		} catch (error) {
			console.error("Initialization error:", error);
			loadingText = "Failed to initialize: " + (error as Error).message;
		} finally {
			isInitializing = false;
		}
	}

	// Initialize on mount
	$effect(() => {
		if (window.TagoIO) {
			window.TagoIO.ready();

			// Load initial widget data
			window.TagoIO.onStart((widget: Widget) => {
				loadingText = "Widget loaded";
				widgetData = widget;
			});

			// Handle real-time updates
			window.TagoIO.onRealtime((data: WidgetVariableData[]) => {
				realtimeData = data;
			});

			// Handle user information
			window.TagoIO.onSyncUserInformation((user: TUserInformation) => {
				widgetUserData = user;
				initializeUserData(widgetUserData);
			});
		} else {
			console.error("TagoIO library is not available.");
			loadingText = "TagoIO library not available";
		}
	});

	// Single effect for fetching devices when apiToken changes
	$effect(() => {
		if (apiToken) {
			loadingText = "Fetching devices...";
			fetchDevices(apiToken)
				.then((data) => {
					devices = data;
					loadingText = "Data loaded successfully";
				})
				.catch((error) => {
					console.error("Error fetching devices:", error);
					loadingText = "Failed to fetch devices";
				});
		}
	});
</script>

<div class="p-4">
	<h1 class="text-2xl mb-4 font-bold">{loadingText}</h1>

	{#if apiToken}
		<div class="mb-4">
			<h2 class="text-xl font-semibold mb-2">Authentication Status</h2>
			<div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-2">
				Authenticated with API
			</div>
		</div>
	{:else}
		<div class="mb-4">
			<h2 class="text-xl font-semibold mb-2">Authentication Status</h2>
			<div
				class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2"
			>
				Not authenticated with API
			</div>
		</div>
	{/if}

	<div class="flex flex-col md:flex-row gap-6">
		<!-- Real-time data display -->
		{#if realtimeData.length > 0}
			<div class="flex-1">
				<h2 class="text-xl font-semibold mb-2">Real-time Data</h2>
				<table class="w-full border-collapse border border-blue-300">
					<thead class="bg-blue-100">
						<tr>
							<th
								class="border border-blue-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
							>
								Variable
							</th>
							<th
								class="border border-blue-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
							>
								Value
							</th>
							<th
								class="border border-blue-300 px-4 py-2 text-left text-sm font-medium text-gray-700"
							>
								Time
							</th>
						</tr>
					</thead>
					<tbody>
						{#each realtimeData as data (data.data.origin)}
							{#each data.result as result (result.id)}
								<tr class="hover:bg-blue-50">
									<td
										class="border border-blue-300 px-4 py-2 text-sm text-gray-600"
									>
										{result.variable}
									</td>
									<td
										class="border border-blue-300 px-4 py-2 text-sm text-gray-600"
									>
										{result.value}
										{result.unit}
									</td>
									<td
										class="border border-blue-300 px-4 py-2 text-sm text-gray-600"
									>
										{new Date(result.time).toLocaleString()}
									</td>
								</tr>
							{/each}
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="flex-1">
				<h2 class="text-xl font-semibold mb-2">Real-time Data</h2>
				<p class="text-gray-600">No real-time data received yet.</p>
			</div>
		{/if}

		<!-- Device information -->
		<div class="flex-1">
			<h2 class="text-xl font-semibold mb-2">Device Information</h2>
			{#if devices && devices.length > 0}
				<ul class="border border-gray-300 rounded divide-y divide-gray-300">
					{#each devices as device}
						<li class="p-3 hover:bg-gray-50">
							<div class="font-medium">{device.name || "Unnamed Device"}</div>
							<div class="text-sm text-gray-600">{device.id}</div>
							{#if device.status}
								<div class="text-xs text-gray-500">Status: {device.status}</div>
							{/if}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-gray-600">No devices available</p>
			{/if}
		</div>
	</div>

	<!-- Debug section -->
	{#if dev}
		<div class="mt-6 border-t pt-4">
			<h2 class="text-xl font-semibold mb-2">Debug Tools</h2>
			<div class="flex gap-2">
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
					onclick={() => console.log("widgetData", $state.snapshot(widgetData))}
				>
					Log Widget Data
				</button>
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
					onclick={() =>
						console.log("realtimeData", $state.snapshot(realtimeData))}
				>
					Log Realtime Data
				</button>
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
					onclick={() => console.log("devices", $state.snapshot(devices))}
				>
					Log Devices
				</button>
				<button
					class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
					onclick={() => {
						if (browser) localStorage.removeItem(TOKEN_STORAGE_KEY);
						apiToken = null;
					}}
				>
					Clear Token
				</button>
			</div>
		</div>
	{/if}
</div>
