import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Injected at build time — set VITE_API_URL in Render's environment variables
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || "http://localhost:5000"),
  },
});
