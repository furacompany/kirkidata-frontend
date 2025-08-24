import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 👇 makes sure assets (images, css, js) use relative paths
  base: "./",

  server: {
    port: 3000,
    host: true, // 👈 ensures it works in docker/easypanel/remote
    open: true,
  },

  preview: {
    port: 4173,
    host: true, // 👈 same fix for preview build
    open: false,
  },

  build: {
    outDir: "dist",
  },
});
