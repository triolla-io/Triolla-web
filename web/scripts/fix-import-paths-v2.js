#!/usr/bin/env node
/**
 * Fix import paths in page.tsx files (version 2)
 * Properly handles all directory levels
 */

const fs = require("fs");
const path = require("path");

function getCorrectImportPath(filePath) {
  const appDir = path.join(__dirname, "..", "app");
  const relativePath = path.relative(appDir, filePath);
  const directoryPath = path.dirname(relativePath);

  if (directoryPath === ".") {
    // Root level file
    return "./lib/metadata";
  }

  // Count slashes to determine depth
  const depth = directoryPath.split(path.sep).length;
  let importPath = "";
  for (let i = 0; i < depth; i++) {
    importPath += "../";
  }
  return importPath + "lib/metadata";
}

function fixImportPaths(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf-8");

    // Skip if doesn't use generatePageMetadata
    if (!content.includes("generatePageMetadata")) {
      return null;
    }

    const correctPath = getCorrectImportPath(filePath);

    // Replace any import of metadata - match various patterns
    const oldContent = content;
    content = content.replace(
      /import \{ generatePageMetadata \} from ["'].*?lib\/metadata["'];/,
      `import { generatePageMetadata } from "${correctPath}";`
    );

    if (content !== oldContent) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return null;
  }
}

function findPageFiles(dirPath) {
  const pageFiles = [];

  function traverse(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith("[") && !file.startsWith(".")) {
        traverse(filePath);
      } else if (file === "page.tsx" || file === "page.ts") {
        pageFiles.push(filePath);
      }
    });
  }

  traverse(dirPath);
  return pageFiles;
}

function main() {
  const appDir = path.join(__dirname, "..", "app");
  const pageFiles = findPageFiles(appDir);

  console.log(`\n🔧 Fixing ${pageFiles.length} page files\n`);

  let fixed = 0;
  let unchanged = 0;

  pageFiles.forEach((filePath) => {
    const result = fixImportPaths(filePath);
    if (result === true) {
      const relativePath = path.relative(appDir, filePath);
      console.log(`✅ Fixed: ${relativePath}`);
      fixed++;
    } else if (result === false) {
      unchanged++;
    }
  });

  console.log(`\n✨ Summary: ${fixed} fixed, ${unchanged} unchanged\n`);
}

main();
