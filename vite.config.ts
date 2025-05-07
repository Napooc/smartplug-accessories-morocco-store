
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine the project root directory
  const projectRoot = process.cwd();
  
  // Force remove and recreate index.html if it's a directory
  const indexHtmlPath = path.resolve(projectRoot, "index.html");
  
  try {
    // Check if path exists and what type it is
    const stats = fs.statSync(indexHtmlPath);
    
    // If it's a directory, remove it and create a file
    if (stats.isDirectory()) {
      console.log("Removing index.html directory and creating file instead");
      fs.rmSync(indexHtmlPath, { recursive: true, force: true });
      
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

    <meta property="og:title" content="Ma7alkom - Accessories & Home Store" />
    <meta property="og:description" content="Your One-Stop Shop for Quality Accessories and Home Products" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@lovable_dev" />
    <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
    
    <!-- Language alternates for SEO -->
    <link rel="alternate" hreflang="en" href="?lang=en" />
    <link rel="alternate" hreflang="fr" href="?lang=fr" />
    <link rel="alternate" hreflang="ar" href="?lang=ar" />
    <link rel="alternate" hreflang="x-default" href="?lang=en" />
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
    // If index.html doesn't exist at all, create it
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

    <meta property="og:title" content="Ma7alkom - Accessories & Home Store" />
    <meta property="og:description" content="Your One-Stop Shop for Quality Accessories and Home Products" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@lovable_dev" />
    <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
    
    <!-- Language alternates for SEO -->
    <link rel="alternate" hreflang="en" href="?lang=en" />
    <link rel="alternate" hreflang="fr" href="?lang=fr" />
    <link rel="alternate" hreflang="ar" href="?lang=ar" />
    <link rel="alternate" hreflang="x-default" href="?lang=en" />
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
  
  // Also create a file in the public directory as a backup
  const publicIndexHtmlPath = path.resolve(projectRoot, "public/index.html");
  if (!fs.existsSync(path.dirname(publicIndexHtmlPath))) {
    fs.mkdirSync(path.dirname(publicIndexHtmlPath), { recursive: true });
  }
  
  // Copy index.html to public directory if it doesn't exist
  if (!fs.existsSync(publicIndexHtmlPath) && fs.existsSync(indexHtmlPath) && fs.statSync(indexHtmlPath).isFile()) {
    fs.copyFileSync(indexHtmlPath, publicIndexHtmlPath);
    console.log("Copied index.html to public directory");
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
