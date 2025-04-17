export function mockTagoIO() {
	window.TagoIO = {
		ready: () => {
			console.log("Mock TagoIO ready called");
		},
		onStart: (callback: (widget: any) => void) => {
			const mockWidget = {
				title: "Mock Widget",
				data: [{ key: "example", value: 42 }],
			};
			callback(mockWidget);
		},
		onRealtime: (callback: (data: any[]) => void) => {
			const mockData = [
				{
					data: {
						qty: 500,
						origin: "mock_origin_id",
						variables: ["temperature"],
						bucket: "mock_bucket_id",
					},
					result: [
						{
							id: "mock_id_1",
							time: "2025-01-16T08:52:27.222Z",
							unit: "°C",
							value: 20.6,
							variable: "temperature",
							group: "mock_group_1",
							device: "mock_device_id",
							origin: "mock_origin_id",
							serie: "mock_serie_1",
						},
						{
							id: "mock_id_2",
							time: "2025-01-16T07:52:26.820Z",
							unit: "°C",
							value: 20.4,
							variable: "temperature",
							group: "mock_group_2",
							device: "mock_device_id",
							origin: "mock_origin_id",
							serie: "mock_serie_2",
						},
						// Additional mock data entries
						{
							id: "mock_id_N",
							time: "2025-01-15T14:52:29.880Z",
							unit: "°C",
							value: 21.4,
							variable: "temperature",
							group: "mock_group_N",
							device: "mock_device_id",
							origin: "mock_origin_id",
							serie: "mock_serie_N",
						},
					],
					cacheTime: null,
				},
			];
			callback(mockData);
		},
		onSyncUserInformation: (callback: (user: any) => void) => {
			const mockUser = {
				token: "73d287b1-8cd9-4d9b-8883-17f34a1007bf",
				language: "string",
				runURL: "string",
				custom_preferences: null,
				preferences: {
					timezone: "string",
					language: "string",
					date_format: "DD/MM/YYYY",
					time_format: "24",
					decimal_separator: ",",
				},
			};
			callback(mockUser);
		},
	};
}
