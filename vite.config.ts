
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Check if index.html exists in the project root
  const indexPath = path.resolve(__dirname, "index.html");
  
  // If index.html doesn't exist, try looking in the public directory
  let finalIndexPath = indexPath;
  if (!fs.existsSync(indexPath)) {
    const publicIndexPath = path.resolve(__dirname, "public/index.html");
    if (fs.existsSync(publicIndexPath)) {
      finalIndexPath = publicIndexPath;
      console.log("Found index.html in public directory");
    } else {
      console.error("Error: index.html not found in project root or public directory!");
    }
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
          main: finalIndexPath,
        },
      },
    },
    // Explicitly set the root directory to ensure index.html is found
    root: process.cwd(),
  };
});
