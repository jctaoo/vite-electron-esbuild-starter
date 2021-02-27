import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { join, resolve } from "path";

// TODO index.html 不在 root 时有 bug
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  base: "./",
  resolve: {
    alias: [
      {
        find: "@renderer",
        replacement: resolve(__dirname, "src/renderer"),
      },
      {
        find: "@common",
        replacement: resolve(__dirname, "src/common"),
      },
    ],
  },
});
