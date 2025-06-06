import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/react-app/",
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: false,
  },
});
