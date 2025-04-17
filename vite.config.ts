import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		hmr: {
			protocol: "wss",
			host: "localhost.klimopnet.com",
			clientPort: 443,
		},
	},
});
