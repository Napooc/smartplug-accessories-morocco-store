
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine the project root directory
  const projectRoot = process.cwd();
  
  // Handle index.html
  const indexHtmlPath = path.resolve(projectRoot, "index.html");
  
  // Check if index.html exists and is a directory (error case)
  try {
    const stats = fs.statSync(indexHtmlPath);
    if (stats.isDirectory()) {
      // If index.html is a directory, rename it
      console.log("Found directory named index.html, renaming it");
      fs.renameSync(indexHtmlPath, path.resolve(projectRoot, "_index.html_dir"));
      
      // Create proper index.html file
      const templateHtml = `<!DOCTYPE html>
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
      fs.writeFileSync(indexHtmlPath, templateHtml);
      console.log("Created new index.html file");
    }
  } catch (error) {
    // If index.html doesn't exist, create it
    if (!fs.existsSync(indexHtmlPath)) {
      const templateHtml = `<!DOCTYPE html>
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
      fs.writeFileSync(indexHtmlPath, templateHtml);
      console.log("Created new index.html file");
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
