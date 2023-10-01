import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  root: "./client",
  plugins: [solidPlugin()],
  server: {
    port: 3000,
    proxy: {
      "/api": "http://127.0.0.1:4000",
      "/ws": {
        target: "ws://127.0.0.1:4000",
        ws: true,
      },
    },
  },
  build: {
    target: "esnext",
  },
});
