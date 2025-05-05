
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine the project root directory
  const projectRoot = process.cwd();
  
  // First, ensure any existing index.html directory is renamed
  const indexHtmlDir = path.resolve(projectRoot, "index.html");
  try {
    const stats = fs.statSync(indexHtmlDir);
    if (stats.isDirectory()) {
      console.log("Found directory named index.html, renaming it to _index.html_dir");
      fs.renameSync(indexHtmlDir, path.resolve(projectRoot, "_index.html_dir"));
    }
  } catch (error) {
    // File doesn't exist or can't be accessed, which is fine
  }
  
  // Define possible paths for index.html
  const possiblePaths = [
    path.resolve(projectRoot, "index.html"),
    path.resolve(projectRoot, "public/index.html")
  ];
  
  // Find the first valid index.html file
  let indexHtmlPath = null;
  for (const filePath of possiblePaths) {
    try {
      // Use statSync to check if the file exists and is a file (not a directory)
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        indexHtmlPath = filePath;
        console.log(`Found valid index.html at: ${indexHtmlPath}`);
        break;
      }
    } catch (error) {
      // File doesn't exist or can't be accessed, try next path
      console.log(`Index.html not found at: ${filePath}`);
    }
  }
  
  // If no valid index.html found, create one in the project root
  if (!indexHtmlPath) {
    console.log("No valid index.html found, creating one in project root");
    const minimalIndexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ma7alkom - Accessories & Home Store</title>
    <meta name="description" content="Ma7alkom - Your One-Stop Shop for Quality Accessories and Home Products" />
    <meta name="author" content="Ma7alkom" />
    <link rel="icon" href="/lovable-uploads/510962dd-e810-4cd9-9b41-1e0a46b8d38c.png" type="image/png">
  </head>
  <body>
    <div id="root"></div>
    <!-- IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT! -->
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    
    const fallbackPath = path.resolve(projectRoot, "index.html");
    fs.writeFileSync(fallbackPath, minimalIndexHtml);
    indexHtmlPath = fallbackPath;
    console.log(`Created fallback index.html at: ${indexHtmlPath}`);
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
