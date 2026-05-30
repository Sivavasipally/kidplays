import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// KidPlays Studio is a fully static, server-free app. It saves projects in the
// browser, so it can be hosted anywhere — including GitHub Pages.
//
// `base: "./"` makes all asset URLs relative, so the build works no matter what
// sub-path it's served from (e.g. https://USER.github.io/REPO/). No need to
// hard-code the repository name.
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1500,
  },
});
