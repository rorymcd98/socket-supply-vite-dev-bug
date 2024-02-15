import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import externalize from "vite-plugin-externalize-dependencies";

export default defineConfig({
  plugins: [
    externalize({
      externals: [/^socket:.*/],
    }),
    react(),
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [/^socket:.*/],
    },
  },
});
