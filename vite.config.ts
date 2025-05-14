
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(() => {
  // Determine the project root directory
  const projectRoot = process.cwd();
  
  // Ensure both index.html files exist
  const indexHtmlPath = path.resolve(projectRoot, "index.html");
  const publicIndexHtmlPath = path.resolve(projectRoot, "public/index.html");
  
  // Create a minimal HTML template
  const minimalHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ma7alkom Admin</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  // Ensure the main index.html exists and is not a directory
  try {
    const indexStat = fs.statSync(indexHtmlPath);
    if (indexStat.isDirectory()) {
      fs.rmSync(indexHtmlPath, { recursive: true, force: true });
      fs.writeFileSync(indexHtmlPath, minimalHtml);
      console.log("Created new index.html (was previously a directory)");
    }
  } catch (err) {
    // File doesn't exist, create it
    fs.writeFileSync(indexHtmlPath, minimalHtml);
    console.log("Created missing index.html");
  }
  
  // Ensure the public/index.html exists as well
  try {
    fs.statSync(publicIndexHtmlPath);
  } catch (err) {
    // Ensure public directory exists
    if (!fs.existsSync(path.dirname(publicIndexHtmlPath))) {
      fs.mkdirSync(path.dirname(publicIndexHtmlPath), { recursive: true });
    }
    // Copy from root or create new
    if (fs.existsSync(indexHtmlPath)) {
      fs.copyFileSync(indexHtmlPath, publicIndexHtmlPath);
    } else {
      fs.writeFileSync(publicIndexHtmlPath, minimalHtml);
    }
    console.log("Created public/index.html");
  }
  
  return {
    server: {
      port: 3000,
      host: true,
      hmr: {
        clientPort: 3000,
      },
    },
    preview: {
      port: 3000,
    },
    resolve: {
      alias: {
        "@": path.resolve(projectRoot, "./src"),
      },
    },
    root: projectRoot,
    publicDir: path.resolve(projectRoot, "public"),
    build: {
      outDir: path.resolve(projectRoot, "dist"),
    },
  };
});
