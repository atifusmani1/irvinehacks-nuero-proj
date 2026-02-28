import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// See AGENT.md §4 — Frontend runs on port 5173, proxies to backend on 8000
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to FastAPI backend during development
      "/debate": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/embeddings": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/health": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
