import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// KidPlays Studio dev server. Proxies API calls to the Flask backend so the
// whole thing runs locally with two simple commands.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1500,
  },
});
