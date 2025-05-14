
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine the project root directory
  const projectRoot = process.cwd();
  
  // Check if index.html exists and is a file (not a directory)
  const indexHtmlPath = path.resolve(projectRoot, "index.html");
  const publicIndexHtmlPath = path.resolve(projectRoot, "public/index.html");
  
  // Ensure index.html is a file, not a directory
  try {
    const indexStat = fs.statSync(indexHtmlPath);
    if (indexStat.isDirectory()) {
      console.warn("Warning: index.html is a directory, removing it...");
      fs.rmSync(indexHtmlPath, { recursive: true, force: true });
      
      // Copy from public if exists, otherwise create a new one
      if (fs.existsSync(publicIndexHtmlPath)) {
        fs.copyFileSync(publicIndexHtmlPath, indexHtmlPath);
        console.log("Copied index.html from public directory");
      } else {
        // This will be created by the lov-write operation above
        console.log("New index.html will be created");
      }
    }
  } catch (err) {
    // File doesn't exist, we'll create it with the write operation above
    console.log("index.html not found, will create it");
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
        "@": path.resolve(projectRoot, "./src"),
      },
    },
    root: projectRoot,
    publicDir: path.resolve(projectRoot, "public"),
    build: {
      outDir: path.resolve(projectRoot, "dist"),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: indexHtmlPath,
        },
      },
    },
  };
});
