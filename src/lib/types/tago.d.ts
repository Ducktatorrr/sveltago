// TODO Temporary disable of `any` rule until everything is typed here.
/* eslint-disable @typescript-eslint/no-explicit-any */

interface ITagoIO {
	ready: () => void;
	onStart: (callbackFn: (widget: any) => void) => void;
	onRealtime: (callbackFn: (data: any) => void) => void;
	sendData: (payload: any, callbackFn: (response: any) => void) => void;
	onSyncUserInformation: (callbackFn: (user: any) => void) => void;
}

export declare global {
	interface Window {
		TagoIO: ITagoIO;
	}
	/**
	User object information
	*/
	export type TUserInformation = {
		token: string;
		language: string;
		runURL: string;
		custom_preferences: Record<string, string> | undefined;
		preferences: {
			timezone: string;
			language: string;
			date_format?: "MM/DD/YYYY" | "YYYY-MM-DD" | "DD/MM/YYYY";
			time_format?: "12" | "24";
			decimal_separator: "." | "," | string;
		};
	} | null;

	/**
	 * Type for a tag object as used in TagoIO's resources.
	 */
	type Tag = {
		/** Tag key. */
		key: string;
		/** Tag value. */
		value: string;
	};

	type VariableSettings = {
		/**
		 * Name of the variable.
		 */
		variable: string;
		/**
		 * Source of the variable's origin.
		 */
		origin: {
			/**
			 * Device ID.
			 */
			id: string;
			/**
			 * Bucket ID.
			 *
			 * @deprecated Only relevant in Legacy devices.
			 */
			bucket?: string;
		};
	};

	/**
	 * Type for the settings of each variable to be resolved when fetching the widget's data from the API.
	 */
	type WidgetDataSettings = {
		/**
		 * Device ID.
		 */
		origin: string;
		/**
		 * Bucket ID.
		 *
		 * @deprecated Only relevant in Legacy devices.
		 */
		bucket?: string;
		/**
		 * Quantity of items to fetch from the variables in the device.
		 */
		qty?: number;
		/**
		 * Variables in the device to be resolved when getting the widget's data from the API.
		 */
		variables: string[];
	};

	/**
	 * Type of the widget.
	 *
	 * Should be only the available types for widgets supporting custom code.
	 */
	type WidgetType = "iframe";

	/**
	 * Type for the widget's configuration object.
	 */
	type Widget = {
		/**
		 * Widget ID.
		 */
		id: string;
		/**
		 * Dashboard ID.
		 */
		dashboard: string;
		/**
		 * Type of the widget.
		 */
		type: WidgetType;
		/**
		 * Label (title) of the widget.
		 */
		label: string;
		/**
		 * Widget's display settings.
		 */
		display: {
			/**
			 * Header buttons configured on the widget.
			 */
			header_buttons: any[];
			/**
			 * Header size for the widget.
			 */
			header_size?: number;
			/**
			 * Help text for the widget.
			 */
			help?: string;
			/**
			 * Theme configuration.
			 */
			theme?: {
				/**
				 * Colors to be used when displaying the widget on Admin/RUN.
				 */
				color?: Record<string, string>;
			};
			/**
			 * URL for the custom widget main HTML file.
			 */
			url: string;
			/**
			 * Variables configured to be fetched and made available to the widget.
			 */
			variables: VariableSettings[];
		};
		/**
		 * Widget's data object with the information from the variables needed by the API to resolve the widget's data.
		 */
		data: WidgetDataSettings[];
		/**
		 * ID of the analysis configured on the widget.
		 */
		analysis_run: string | null;
	};

	/**
	 * Type for a single data record resolved as widget data.
	 */
	type WidgetVariableResultItem = {
		/**
		 * Data record ID.
		 */
		id: string;
		/**
		 * Value for the data record.
		 */
		value: string | number | boolean;
		/**
		 * Timestamp for the data record.
		 *
		 * Note that this is not necessarily the timestamp for the creation of the record as it can be explicitly set.
		 */
		time: string;
		/**
		 * Device ID for the device this data record belongs to.
		 */
		device: string;
		/**
		 * Group for the data record to be associated with other data records.
		 */
		group: string;
		/**
		 * Variable for the data record.
		 */
		variable: string;
		/**
		 * Optional metadata information for the record.
		 */
		metadata?: Record<string, any>;
		/**
		 * Unit for the value of the data record.
		 */
		unit?: string;
	};

	/**
	 * Type for an item in the widget's resolved data containing the variable and device's settings and resulting data records.
	 */
	type WidgetVariableData = {
		/**
		 * Variable's settings used for the resolved widget data item.
		 */
		data: WidgetDataSettings;
		/**
		 * Data records resolved as widget data according to variable's settings in `data`.
		 */
		result: WidgetVariableResultItem[];
	};

	/**
	 * Type for the viewable fields in a device resource.
	 */
	type DeviceViewableField =
		| "name"
		| "id"
		| "bucket_name"
		| "network_name"
		| "connector_name"
		| "bucket"
		| "connector"
		| "network"
		| "last_input"
		| "created_at"
		| "active"
		| `tags.${string}`
		| `param.${string}`;

	/**
	 * Type for the editable fields in a device resource.
	 */
	type DeviceEditableField = "name" | `tags.${string}` | `param.${string}`;

	/**
	 * Type for a device resource configuration to resolve devices on a widget's data.
	 */
	type WidgetDeviceSettings = {
		/**
		 * Type of resource.
		 */
		type: "device";
		/**
		 * Types with viewing enabled for a device.
		 *
		 * If not present in this list, it won't be returned in the resolve widget request.
		 */
		view: DeviceViewableField[];
		/**
		 * Types with viewing enabled for a device.
		 *
		 * If not present in this list, it won't be editable via API even if the widget allows it.
		 */
		editable: DeviceEditableField[];
		/**
		 * Tag filters for the devices to be resolved to the widget.
		 */
		filter: Tag[];
		/**
		 * Amount of resources to get/returned from the API.
		 */
		amount?: number;
	};

	/**
	 * Type for a single device resolved as widget data.
	 */
	type WidgetDeviceResultItem = {
		/**
		 * Device ID.
		 */
		id: string;
		/**
		 * Name of the device.
		 */
		name?: string;
		/**
		 * Name of the network the device has configured.
		 */
		network_name?: string;
		/**
		 * Name of the connector the device has configured.
		 */
		connector_name?: string;
		/**
		 * Timestamp for the last input in the device.
		 */
		last_input?: string;
		/**
		 * Configuration parameters the device has configured.
		 */
		params?: Array<{
			id: string;
			key: string;
			value: string;
		}>;
		/**
		 * Tags the device has configured.
		 */
		tags?: Tag[];
	};

	/**
	 * Type for an item in the widget's resolved data containing the device resource's settings and resulting devices.
	 */
	type WidgetDeviceData = {
		/**
		 * Device resource's settings used for the resolved widget data item.
		 */
		resource: WidgetDeviceSettings;
		/**
		 * Devices resolved as widget data according to `resource`'s settings.
		 */
		result: WidgetDeviceResultItem[];
	};

	/**
	 * Type for the viewable fields in a user resource.
	 */
	type UserViewableField =
		| "name"
		| "id"
		| "email"
		| "phone"
		| "company"
		| "language"
		| "timezone"
		| "password"
		| "created_at"
		| "last_login"
		| `tags.${string}`;

	/**
	 * Type for the editable fields in a user resource.
	 */
	type UserEditableField =
		| "name"
		| "phone"
		| "company"
		| "password"
		| "language"
		| "timezone"
		| `tags.${string}`;

	/**
	 * Type for a user resource configuration to resolve users on a widget's data.
	 */
	type WidgetUserSettings = {
		/**
		 * Type of resource.
		 */
		type: "user";
		/**
		 * Types with viewing enabled for a user.
		 *
		 * If not present in this list, it won't be returned in the resolve widget request.
		 */
		view: UserViewableField[];
		/**
		 * Types with viewing enabled for a user.
		 *
		 * If not present in this list, it won't be editable via API even if the widget allows it.
		 */
		editable: UserEditableField[];
		/**
		 * Tag filters for the users to be resolved to the widget.
		 */
		filter: Tag[];
		/**
		 * Amount of users to get/returned from the API.
		 */
		amount?: number;
	};

	/**
	 * Type for a single user resolved as widget data.
	 */
	type WidgetUserResultItem = {
		/**
		 * User ID.
		 */
		id: string;
		/**
		 * Name of the user.
		 */
		name?: string;
		/**
		 * E-mail of the user.
		 */
		email?: string;
		/**
		 * Phone of the user.
		 */
		phone?: string;
		/**
		 * Company of the user.
		 */
		company?: string;
		/**
		 * Language selected for the user.
		 */
		language?: string;
		/**
		 * Timezone of the user.
		 */
		timezone?: string;
		/**
		 * Tags configured on the user.
		 */
		tags?: Tag[];
		/**
		 * Timestamp for the user's last login.
		 */
		last_login?: string;
		/**
		 * Timestamp for when the user was created.
		 */
		created_at?: string;
	};

	/**
	 * Type for an item in the widget's resolved data containing the user resource's settings and resulting users.
	 */
	type WidgetUserData = {
		/**
		 * User resource's settings used for the resolved widget data item.
		 */
		resource: WidgetUserSettings;
		/**
		 * Users resolved as widget data according to `resource`'s settings.
		 */
		result: WidgetUserResultItem[];
	};

	/**
	 * Type union for the different types of resolved resource objects.
	 */
	type WidgetResourceData = WidgetDeviceData | WidgetUserData;

	/**
	 * Type for an item in the resolved widget's data.
	 *
	 * The full widget's data is an array containing objects, where each object has the results for the resolved data
	 * and the settings used when resolving. These settings can be either `data` (for data from variables) or `resource`
	 * (for data from resources).
	 *
	 * Needs to be disambiguated as the array will have data from variables mixed with resource data (e.g. devices and
	 * users).
	 */
	type WidgetData = WidgetVariableData | WidgetResourceData;
}
