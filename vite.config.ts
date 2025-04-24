
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine the project root directory
  const projectRoot = process.cwd();
  
  // Possible locations for index.html
  const possiblePaths = [
    path.resolve(projectRoot, "index.html"),
    path.resolve(projectRoot, "public/index.html")
  ];
  
  // Find the first existing index.html file
  let indexHtmlPath = null;
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      indexHtmlPath = filePath;
      console.log(`Found index.html at: ${indexHtmlPath}`);
      break;
    }
  }
  
  if (!indexHtmlPath) {
    console.error("ERROR: index.html not found in any expected location!");
    // Create a minimal index.html in the root to prevent build failure
    const minimalIndexHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Ma7alkom</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/src/main.tsx"></script>
        </body>
      </html>
    `;
    const fallbackPath = path.resolve(projectRoot, "index.html");
    fs.writeFileSync(fallbackPath, minimalIndexHtml);
    indexHtmlPath = fallbackPath;
    console.log(`Created fallback index.html at: ${indexHtmlPath}`);
  }
  
  // Determine the root directory based on where index.html was found
  const rootDir = path.dirname(indexHtmlPath);
  
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
    root: rootDir,
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
