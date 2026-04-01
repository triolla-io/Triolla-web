#!/usr/bin/env node

/**
 * Duplicate HTML Section Detector
 *
 * Scans the fragments directory for duplicate HTML sections
 * and identifies consolidation opportunities.
 *
 * Usage: node scripts/detect-duplicates.js [--verbose] [--min-count N]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FRAGMENTS_DIR = path.join(__dirname, '../web/public/fragments');
const MIN_OCCURRENCES = process.argv.includes('--min-count')
  ? parseInt(process.argv[process.argv.indexOf('--min-count') + 1])
  : 5;
const VERBOSE = process.argv.includes('--verbose');

// Common semantic section patterns to look for
const SECTION_PATTERNS = [
  // Pattern name, regex or string, description
  ['unique_design', 'class="unique_design"', 'Design process flow with 8 steps'],
  ['portfolio_banner', 'class="portfolio_banner"', 'Portfolio showcase banner'],
  ['design_wrap', 'class="design_wrap"', 'Design section wrapper'],
  ['port_cyber_con', 'class="port_cyber_con"', 'Portfolio cybersecurity content'],
  ['blogtoptxt', 'class="blogtoptxt"', 'Blog top text section'],
  ['bullet_txt', 'class="bullet_txt"', 'Bulleted text items'],
  ['faqsec', 'class="faqsec"', 'FAQ section'],
  ['testimonial', 'class="testimonial"', 'Testimonial cards'],
  ['cta_section', 'class="cta_section"', 'Call-to-action section'],
  ['stats_block', 'class="stats_block"', 'Statistics block'],
];

// Class-based patterns (find classes appearing 10+ times)
const CLASS_PATTERNS = [
  'marrow',
  'sub-menu',
  'clr',
  'menu',
  'hover-text',
  'default-text',
  'button-overlay',
  'grid__item-img',
  'bullet_txt',
  'port_cyber_con',
  'blacktxt',
  'blackimg',
  'portfolio_banner',
  'blogtoptxt',
  'blogtopimg',
  'main_container',
  'logo',
  'header_wrap',
  'header_menu',
];

/**
 * Search for pattern in all fragment files
 */
function searchPattern(pattern) {
  try {
    // Escape special regex characters if needed
    const escapedPattern = pattern.replace(/"/g, '\\"');
    const result = execSync(
      `grep -r '${escapedPattern.replace(/'/g, "'\\''")}' ${FRAGMENTS_DIR} 2>/dev/null | wc -l`,
      { encoding: 'utf-8', shell: '/bin/bash' }
    ).trim();
    const count = parseInt(result) || 0;

    if (count > 0) {
      // Now count files, not lines
      const fileResult = execSync(
        `grep -rl '${escapedPattern.replace(/'/g, "'\\''")}' ${FRAGMENTS_DIR} 2>/dev/null | wc -l`,
        { encoding: 'utf-8', shell: '/bin/bash' }
      ).trim();
      return parseInt(fileResult) || 0;
    }
    return 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Get files containing pattern
 */
function getFilesWithPattern(pattern) {
  try {
    const escapedPattern = pattern.replace(/"/g, '\\"');
    const result = execSync(
      `grep -rl '${escapedPattern.replace(/'/g, "'\\''")}' ${FRAGMENTS_DIR} 2>/dev/null`,
      { encoding: 'utf-8', shell: '/bin/bash', maxBuffer: 10 * 1024 * 1024 }
    ).trim();

    if (!result) return [];
    return result.split('\n')
      .map(f => path.basename(f))
      .filter(Boolean);
  } catch (error) {
    return [];
  }
}

/**
 * Extract section containing pattern
 */
function extractSection(filePath, pattern, contextLines = 5) {
  try {
    const result = execSync(
      `grep -A ${contextLines} -B 2 "${pattern}" "${filePath}" 2>/dev/null`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    );
    return result;
  } catch (error) {
    return null;
  }
}

/**
 * Get total fragment file count
 */
function getTotalFragmentCount() {
  try {
    const result = execSync(
      `find ${FRAGMENTS_DIR} -type f -name "*.html" | wc -l`,
      { encoding: 'utf-8' }
    ).trim();
    return parseInt(result) || 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Main detection logic
 */
function runDuplicateDetection() {
  console.log('\n' + '='.repeat(70));
  console.log('DUPLICATE HTML SECTION DETECTOR');
  console.log('='.repeat(70));

  const totalFiles = getTotalFragmentCount();
  console.log(`\nScanning ${totalFiles} fragment files in ${FRAGMENTS_DIR}...\n`);

  const duplicates = [];
  const highPriority = [];

  // Check semantic patterns
  console.log('Checking semantic section patterns...\n');

  for (const [name, pattern, description] of SECTION_PATTERNS) {
    const count = searchPattern(pattern);

    if (count > 0) {
      const files = getFilesWithPattern(pattern);
      const priority = count >= 10 ? 'HIGH' : count >= MIN_OCCURRENCES ? 'MEDIUM' : 'LOW';

      const item = {
        name,
        pattern,
        description,
        count,
        files,
        priority,
        percentage: ((count / totalFiles) * 100).toFixed(1),
      };

      duplicates.push(item);

      if (count >= 10) {
        highPriority.push(item);
      }

      const icon = count >= 10 ? '🔴' : count >= 5 ? '🟡' : '🟢';
      console.log(`${icon} ${name.padEnd(20)} | ${count.toString().padEnd(3)} files | ${item.percentage}% | ${priority.padEnd(6)} | ${description}`);

      if (VERBOSE && count >= MIN_OCCURRENCES) {
        console.log(`   Files: ${files.slice(0, 3).join(', ')}${files.length > 3 ? ` +${files.length - 3} more` : ''}`);
      }
    }
  }

  // Sort by count descending
  duplicates.sort((a, b) => b.count - a.count);

  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total patterns found: ${duplicates.length}`);
  console.log(`High priority (10+ occurrences): ${highPriority.length}`);
  console.log(`Medium priority (5-9 occurrences): ${duplicates.filter(d => d.count >= 5 && d.count < 10).length}`);

  // Consolidation recommendations
  if (highPriority.length > 0) {
    console.log('\n' + '='.repeat(70));
    console.log('RECOMMENDED CONSOLIDATIONS (HIGH PRIORITY)');
    console.log('='.repeat(70));

    highPriority.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.name}`);
      console.log(`   Pattern: ${item.pattern}`);
      console.log(`   Occurrences: ${item.count} files (${item.percentage}% of total)`);
      console.log(`   Description: ${item.description}`);
      console.log(`   Files affected: ${item.files.length}`);
      console.log(`   Estimated savings: ${Math.round(item.count / 4)} KB (if 400 bytes per section)`);
      console.log(`   Consolidation path:`);

      const componentName = item.name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

      console.log(`   - Component: web/app/components/${componentName}.tsx`);
      console.log(`   - Template: web/public/assets/_shared/${item.name}-template.html`);
      console.log(`   - Metadata: web/app/metadata/${item.name}-metadata.json`);
    });
  }

  // Export detailed report
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles,
    duplicatesFound: duplicates.length,
    highPriority: highPriority.map(d => ({
      name: d.name,
      pattern: d.pattern,
      description: d.description,
      occurrences: d.count,
      percentage: parseFloat(d.percentage),
      files: d.files,
      estimatedSavings: `${Math.round(d.count / 4)} KB`,
    })),
    allDuplicates: duplicates.map(d => ({
      name: d.name,
      pattern: d.pattern,
      description: d.description,
      occurrences: d.count,
      percentage: parseFloat(d.percentage),
      priority: d.priority,
      fileCount: d.files.length,
    })),
  };

  // Save report
  const reportPath = path.join(__dirname, '../DUPLICATE_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);

  return report;
}

// Run detection
try {
  runDuplicateDetection();
} catch (error) {
  console.error('Error running duplicate detection:', error.message);
  process.exit(1);
}
