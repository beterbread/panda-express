import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
  },

  server: {
    // morgan add on so my stuff will ACTUALLY UPDATE without me re-running
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
});
