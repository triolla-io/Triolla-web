#!/usr/bin/env node
/**
 * Fix import paths in page.tsx files based on directory depth
 * Usage: node scripts/fix-import-paths.js
 */

const fs = require("fs");
const path = require("path");

function countDirectoryDepth(filePath) {
  const appDir = path.join(__dirname, "..", "app");
  const relativePath = path.relative(appDir, filePath);
  const depth = relativePath.split(path.sep).length - 1; // -1 because last is filename
  return depth;
}

function getCorrectImportPath(depth) {
  let importPath = "";
  for (let i = 1; i < depth; i++) {
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

    const depth = countDirectoryDepth(filePath);
    const correctPath = getCorrectImportPath(depth);

    // Replace any import of metadata
    const oldContent = content;
    content = content.replace(
      /import \{ generatePageMetadata \} from ".*\/lib\/metadata";/,
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

  console.log(`\n🔧 Checking ${pageFiles.length} page files for import paths\n`);

  let fixed = 0;
  let unchanged = 0;
  let errors = 0;

  pageFiles.forEach((filePath) => {
    const result = fixImportPaths(filePath);
    if (result === true) {
      const relativePath = path.relative(appDir, filePath);
      console.log(`✅ Fixed: ${relativePath}`);
      fixed++;
    } else if (result === false) {
      unchanged++;
    } else {
      errors++;
    }
  });

  console.log(`\n✨ Summary: ${fixed} fixed, ${unchanged} unchanged, ${errors} errors\n`);
}

main();
