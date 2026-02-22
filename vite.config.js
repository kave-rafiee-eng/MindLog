import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    fs: {
      // Allow serving files from the project root and one level up (e.g., in a monorepo)
      allow: [".", ".."],
    },
  },
  plugins: [react()],
});
