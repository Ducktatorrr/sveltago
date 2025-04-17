// src/lib/api.ts
import { browser } from "$app/environment";

// Constants
export const TAGO_USER_INFO_URL =
	"https://api.tago.io/run/app.connect-iot.eu/info";
export const API_URL = "https://api.connect-iot.eu";
export const TOKEN_STORAGE_KEY = "access_token";

// Types
export interface TagoUser {
	id: string;
	name: string;
	email: string;
	// Add other TagoIO user properties as needed
}

export interface TUserInformation {
	token: string;
	// Add other TagoIO user info properties
}

export interface Widget {
	id: string;
	name: string;
	// Add other widget properties
}

export interface WidgetVariable {
	variable: string;
	value: any;
	unit: string;
	id: string;
	time: string;
}

export interface WidgetVariableData {
	data: {
		origin: string;
	};
	result: WidgetVariable[];
}

export interface Device {
	id: string;
	name: string;
	status?: string;
	last_connection?: string;
	// Add other device properties as needed
}

export interface ApiToken {
	access_token: string;
	expires_in?: number;
	token_type?: string;
}

/**
 * Parses a JWT token to get its payload
 */
export function parseJwt(token: string) {
	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join("")
		);
		return JSON.parse(jsonPayload);
	} catch (error) {
		console.error("Error parsing JWT:", error);
		return null;
	}
}

/**
 * Checks if a token exists and is still valid
 */
export function isTokenValid(token: string): boolean {
	if (!token) return false;

	const payload = parseJwt(token);
	if (!payload || !payload.exp) return false;

	// Check if token is expired
	const expiryTime = payload.exp * 1000; // Convert to milliseconds
	return Date.now() < expiryTime;
}

/**
 * Fetches a new API token from our backend
 */
export async function fetchApiToken(
	user: TagoUser & { token: string }
): Promise<string | null> {
	try {
		const response = await fetch(`${API_URL}/users/tagoio-token`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(user),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data: ApiToken = await response.json();
		const token = data.access_token;

		// Store the token in localStorage
		if (browser && token) {
			localStorage.setItem(TOKEN_STORAGE_KEY, token);
		}

		return token;
	} catch (error) {
		console.error("Error fetching access token:", error);
		throw error;
	}
}

/**
 * Retrieves a valid API token, either from localStorage or by fetching a new one
 */
export async function getValidApiToken(
	userInfo?: TagoUser & { token: string }
): Promise<string | null> {
	// Check localStorage first
	if (browser) {
		const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
		if (storedToken && isTokenValid(storedToken)) {
			return storedToken;
		}
	}

	// If no valid token in storage, fetch a new one
	if (userInfo) {
		try {
			const token = await fetchApiToken(userInfo);
			return token;
		} catch (error) {
			console.error("Failed to get API token:", error);
			return null;
		}
	}

	return null;
}

/**
 * Fetches TagoIO user information
 */
export async function fetchTagoUserInfo(
	tagoToken: string
): Promise<TagoUser | null> {
	if (!tagoToken) return null;

	try {
		const response = await fetch(TAGO_USER_INFO_URL, {
			method: "GET",
			headers: { Token: tagoToken },
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();
		return data.result;
	} catch (error) {
		console.error("Error fetching TagoIO user info:", error);
		throw error;
	}
}

/**
 * Fetches devices from our API
 */
export async function fetchDevices(token: string): Promise<Device[]> {
	if (!token) return [];

	try {
		const response = await fetch(`${API_URL}/devices/`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching devices:", error);
		throw error;
	}
}
