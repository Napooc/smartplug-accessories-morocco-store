
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Check if index.html exists in the project root
  const indexPath = path.resolve(__dirname, "index.html");
  
  if (!fs.existsSync(indexPath)) {
    console.error("Error: index.html not found at project root!");
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: indexPath,
        },
      },
    },
    // Explicitly set the root directory to ensure index.html is found
    root: __dirname,
  };
});
