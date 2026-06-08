import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/soft-club-ui/",
  plugins: [react(), tailwindcss()]
});
