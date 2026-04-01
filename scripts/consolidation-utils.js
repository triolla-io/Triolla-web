#!/usr/bin/env node

/**
 * Consolidation Utilities
 *
 * Helpers for consolidating duplicate HTML sections into React components.
 * Supports:
 * - Finding all files with a specific section
 * - Extracting section HTML
 * - Generating replacement code
 * - Creating metadata templates
 *
 * Usage: node scripts/consolidation-utils.js <command> [options]
 *
 * Commands:
 *   find-section <class-name>           - Find all files containing a section
 *   extract-section <file> <class-name> - Extract HTML for a section
 *   generate-component <name>           - Generate component boilerplate
 *   generate-metadata <name> [files]    - Generate metadata JSON
 *   list-patterns                       - List all detected patterns
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FRAGMENTS_DIR = path.join(__dirname, '../web/public/fragments');
const COMPONENTS_DIR = path.join(__dirname, '../web/app/components');
const METADATA_DIR = path.join(__dirname, '../web/app/metadata');
const TEMPLATES_DIR = path.join(__dirname, '../web/public/assets/_shared');

const command = process.argv[2];
const args = process.argv.slice(3);

// Utility: Convert kebab-case to PascalCase
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// Utility: Get all files matching pattern
function getFilesWithClass(className) {
  try {
    const result = execSync(
      `grep -rl 'class="[^"]*${className}[^"]*"' ${FRAGMENTS_DIR} 2>/dev/null`,
      { encoding: 'utf-8', shell: '/bin/bash', maxBuffer: 10 * 1024 * 1024 }
    ).trim();

    if (!result) return [];
    return result.split('\n').map(f => path.basename(f)).filter(Boolean);
  } catch (error) {
    return [];
  }
}

// Utility: Extract section from HTML file
function extractSection(filePath, className, contextLines = 150) {
  try {
    // First, find the opening div
    const content = fs.readFileSync(filePath, 'utf-8');

    // Find class with regex to handle variations
    const classRegex = new RegExp(
      `<div[^>]*class="[^"]*${className}[^"]*"[^>]*>`,
      'i'
    );

    const match = content.match(classRegex);
    if (!match) return null;

    const startIndex = match.index;

    // Find matching closing div
    let depth = 1;
    let currentIndex = startIndex + match[0].length;
    let closingIndex = -1;

    while (depth > 0 && currentIndex < content.length) {
      const openDiv = content.indexOf('<div', currentIndex);
      const closeDiv = content.indexOf('</div>', currentIndex);

      if (closeDiv === -1) break;

      if (openDiv !== -1 && openDiv < closeDiv) {
        depth++;
        currentIndex = openDiv + 4;
      } else {
        depth--;
        if (depth === 0) {
          closingIndex = closeDiv + 6;
        }
        currentIndex = closeDiv + 6;
      }
    }

    if (closingIndex === -1) return null;

    return content.substring(startIndex, closingIndex);
  } catch (error) {
    console.error(`Error extracting section: ${error.message}`);
    return null;
  }
}

// Command: Find section
function cmdFindSection() {
  const className = args[0];
  if (!className) {
    console.error('Usage: find-section <class-name>');
    process.exit(1);
  }

  const files = getFilesWithClass(className);

  if (files.length === 0) {
    console.log(`No files found with class="${className}"`);
    return;
  }

  console.log(`\nFound "${className}" in ${files.length} files:\n`);
  files.forEach((file, i) => {
    console.log(`${i + 1}. ${file}`);
  });

  console.log(`\nTotal: ${files.length} files`);
  console.log(`\nTo extract from a file:`);
  console.log(`  node scripts/consolidation-utils.js extract-section <file> ${className}`);

  return files;
}

// Command: Extract section
function cmdExtractSection() {
  const file = args[0];
  const className = args[1];

  if (!file || !className) {
    console.error('Usage: extract-section <file> <class-name>');
    process.exit(1);
  }

  const filePath = path.join(FRAGMENTS_DIR, file);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${file}`);
    process.exit(1);
  }

  const section = extractSection(filePath, className);

  if (!section) {
    console.error(`Section with class="${className}" not found in ${file}`);
    process.exit(1);
  }

  console.log(`\n=== EXTRACTED SECTION ===\n`);
  console.log(section);
  console.log(`\n=== END SECTION ===\n`);
  console.log(`Section length: ${section.length} characters`);

  // Save to file option
  const outputFile = path.join(__dirname, `../_extracted_${className}.html`);
  fs.writeFileSync(outputFile, section);
  console.log(`Saved to: ${outputFile}`);

  return section;
}

// Command: Generate component boilerplate
function cmdGenerateComponent() {
  const name = args[0];
  if (!name) {
    console.error('Usage: generate-component <name>');
    console.error('Example: generate-component portfolio-banner');
    process.exit(1);
  }

  const componentName = toPascalCase(name);
  const kebabName = name;

  const template = `'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';

interface ${componentName}Props {
  // Add your props here
  variant?: 'default' | 'compact';
  customMetadataKey?: string;
}

/**
 * ${componentName} Component
 *
 * Consolidated from duplicate sections found across multiple fragment files.
 * Original class pattern: ${kebabName}
 *
 * Metadata: web/app/metadata/${kebabName}-metadata.json
 * Template: web/public/assets/_shared/${kebabName}-template.html
 */
export default function ${componentName}({
  variant = 'default',
  customMetadataKey,
}: ${componentName}Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Initialize any animations or interactions
    if (!containerRef.current) return;

    // Add initialization logic here
  }, []);

  return (
    <div
      ref={containerRef}
      data-component="${componentName}"
      data-variant={variant}
      className="${kebabName}"
    >
      {/* Component content here */}
    </div>
  );
}
`;

  const componentPath = path.join(COMPONENTS_DIR, `${componentName}.tsx`);

  if (fs.existsSync(componentPath)) {
    console.error(`Component already exists: ${componentPath}`);
    process.exit(1);
  }

  fs.writeFileSync(componentPath, template);

  console.log(`\n✓ Component created: ${componentPath}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Edit the component to match your requirements`);
  console.log(`  2. Create metadata: node scripts/consolidation-utils.js generate-metadata ${name}`);
  console.log(`  3. Extract template: node scripts/consolidation-utils.js extract-section <file> ${kebabName}`);

  return componentPath;
}

// Command: Generate metadata template
function cmdGenerateMetadata() {
  const name = args[0];
  const fileList = args.slice(1);

  if (!name) {
    console.error('Usage: generate-metadata <name> [files...]');
    console.error('Example: generate-metadata portfolio-banner home-body.html about-us-body.html');
    process.exit(1);
  }

  const metadataTemplate = {
    [name]: {
      default: {
        // Add default configuration here
        consolidatedFrom: fileList.length > 0 ? fileList : ['multiple files'],
        consolidationDate: new Date().toISOString().split('T')[0],
        consolidationNotes: `Consolidated from duplicate ${name} sections across fragment files.`,
      },
    },
    consolidationMetadata: {
      componentName: toPascalCase(name),
      componentPath: `web/app/components/${toPascalCase(name)}.tsx`,
      templatePath: `web/public/assets/_shared/${name}-template.html`,
      metadataPath: `web/app/metadata/${name}-metadata.json`,
      duplicateClassName: name,
      totalOccurrences: fileList.length,
      filesAffected: fileList.length,
      editable: true,
      editableFields: [
        'title',
        'subtitle',
        'description',
        'content',
      ],
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
    },
  };

  const metadataPath = path.join(METADATA_DIR, `${name}-metadata.json`);

  // Create metadata dir if needed
  if (!fs.existsSync(METADATA_DIR)) {
    fs.mkdirSync(METADATA_DIR, { recursive: true });
  }

  fs.writeFileSync(metadataPath, JSON.stringify(metadataTemplate, null, 2));

  console.log(`\n✓ Metadata created: ${metadataPath}`);
  console.log(`\nEdit this file to add component-specific fields and configuration.`);

  return metadataPath;
}

// Command: List patterns
function cmdListPatterns() {
  console.log('\n=== COMMON CLASS PATTERNS ===\n');

  const patterns = [
    ['unique_design', 'Design process flow'],
    ['portfolio_banner', 'Portfolio showcase'],
    ['port_cyber_con', 'Cybersecurity content'],
    ['bullet_txt', 'Bulleted text items'],
    ['faqsec', 'FAQ section'],
    ['testimonial', 'Testimonials'],
    ['cta_section', 'Call-to-action'],
  ];

  patterns.forEach(([pattern, description]) => {
    const files = getFilesWithClass(pattern);
    const count = files.length;
    const priority = count >= 20 ? 'HIGH' : count >= 10 ? 'MEDIUM' : 'LOW';
    console.log(`${pattern.padEnd(20)} | ${count.toString().padEnd(3)} files | ${priority.padEnd(6)} | ${description}`);
  });

  console.log(`\nTo get more details: node scripts/detect-duplicates.js`);
}

// Main command router
function main() {
  if (!command) {
    console.log(`
Consolidation Utilities

Usage: node scripts/consolidation-utils.js <command> [options]

Commands:
  find-section <class-name>           Find all files with a section
  extract-section <file> <class-name> Extract section HTML
  generate-component <name>           Generate component boilerplate
  generate-metadata <name> [files]    Generate metadata JSON
  list-patterns                       List common patterns

Examples:
  node scripts/consolidation-utils.js find-section unique_design
  node scripts/consolidation-utils.js extract-section home-body.html unique_design
  node scripts/consolidation-utils.js generate-component portfolio-banner
  node scripts/consolidation-utils.js generate-metadata portfolio-banner
  node scripts/consolidation-utils.js list-patterns

For automated analysis: node scripts/detect-duplicates.js
    `);
    process.exit(0);
  }

  switch (command) {
    case 'find-section':
      cmdFindSection();
      break;
    case 'extract-section':
      cmdExtractSection();
      break;
    case 'generate-component':
      cmdGenerateComponent();
      break;
    case 'generate-metadata':
      cmdGenerateMetadata();
      break;
    case 'list-patterns':
      cmdListPatterns();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

main();
