#!/usr/bin/env node
/**
 * Batch update page.tsx files with proper SEO metadata
 * Usage: node scripts/update-seo-metadata.js
 */

const fs = require("fs");
const path = require("path");

// Metadata mapping for different page types
const pageMetadataMap = {
  // Main pages
  "about-us": {
    title: "About Us | Triolla",
    description:
      "Meet Triolla - a team of experienced UX/UI designers dedicated to creating world-class digital products.",
  },
  "accessibility-statement": {
    title: "Accessibility Statement | Triolla",
    description: "Triolla's commitment to web accessibility and inclusive design.",
  },
  blog: {
    title: "Blog | Triolla UX/UI Design",
    description:
      "UX/UI design insights, trends, and case studies from the Triolla team.",
  },
  careers: {
    title: "Careers at Triolla | Join Our Team",
    description:
      "Join Triolla, a leading UX/UI design studio in Israel. Explore career opportunities.",
  },
  "contact-us": {
    title: "Contact Us | Triolla",
    description: "Get in touch with Triolla for UX/UI design and product work.",
  },
  branding: {
    title: "Branding Studio | Triolla",
    description: "Create powerful brand identities with Triolla's branding services.",
  },
  "dashboard-design": {
    title: "Dashboard Design Services | Triolla",
    description:
      "Custom dashboard UI design for your business intelligence and data visualization needs.",
  },

  // Industry/Vertical Pages
  agritech: {
    title: "AgriTech UX/UI Design Services | Triolla",
    description:
      "Specialized UX/UI design for agricultural technology solutions.",
  },
  "b2b": {
    title: "B2B Product Design | Triolla",
    description: "Expert UX/UI design for B2B software and enterprise solutions.",
  },
  "b2c": {
    title: "B2C Product Design | Triolla",
    description:
      "Consumer-focused UX/UI design that drives engagement and conversions.",
  },
  "cyber-security": {
    title: "Cybersecurity App UX/UI Design | Triolla",
    description:
      "Design secure and usable cybersecurity solutions with Triolla.",
  },
  "device-iot": {
    title: "IoT & Device UX/UI Design | Triolla",
    description:
      "User experience design for IoT devices and connected products.",
  },
  "fintech-finance": {
    title: "FinTech UX/UI Design Services | Triolla",
    description:
      "Specialized design for financial technology and banking applications.",
  },
  gaming: {
    title: "Gaming App UX/UI Design | Triolla",
    description: "Immersive and engaging UX/UI design for gaming applications.",
  },
  "medical-healthcare": {
    title: "HealthCare & Medical App Design | Triolla",
    description:
      "Compassionate UX/UI design for healthcare and medical solutions.",
  },
  "mobile-apps": {
    title: "Mobile App Design Services | Triolla",
    description:
      "User-centric mobile app design for iOS and Android platforms.",
  },
  "saas-platforms": {
    title: "SaaS Product Design | Triolla",
    description:
      "Scalable and intuitive UX/UI design for Software-as-a-Service products.",
  },
  "startups-tech": {
    title: "Startup Tech Product Design | Triolla",
    description:
      "Full-cycle product design services for innovative tech startups.",
  },
  technology: {
    title: "Technology Solutions Design | Triolla",
    description:
      "Custom product development and design for cutting-edge technology.",
  },

  // Service Pages
  services: {
    title: "UX/UI Design Services | Triolla",
    description:
      "Explore our comprehensive UX/UI design services including research, wireframing, prototyping, and design systems.",
  },
  "services-ux-research": {
    title: "UX Research Services | Triolla",
    description:
      "In-depth user research to inform better product design decisions.",
  },
  "services-wireframing": {
    title: "Wireframing Services | Triolla",
    description: "Professional wireframing to visualize your product structure.",
  },
  "services-prototyping": {
    title: "Prototyping Services | Triolla",
    description:
      "Interactive prototypes to validate your design concepts before development.",
  },
  "services-ui-design": {
    title: "UI Design Services | Triolla",
    description:
      "Beautiful and functional user interface design that users love.",
  },
  "services-product-ux-ui-design": {
    title: "Product UX/UI Design | Triolla",
    description:
      "Complete UX/UI design for digital products from concept to launch.",
  },
  "services-design-system-creation": {
    title: "Design System Creation | Triolla",
    description:
      "Build scalable design systems for consistent and efficient product development.",
  },
  "services-front-end-dev": {
    title: "Front-End Development | Triolla",
    description:
      "Expert front-end development to bring your designs to life.",
  },
  "services-back-end-dev": {
    title: "Back-End Development | Triolla",
    description: "Robust back-end solutions for your digital products.",
  },
  "services-motion-design": {
    title: "Motion Design & Animation | Triolla",
    description:
      "Engaging animations and motion design to enhance user experience.",
  },
};

function getMetadataForPage(slug) {
  return (
    pageMetadataMap[slug] || {
      title: `${slug} | Triolla`,
      description: `Learn more about ${slug} at Triolla.`,
    }
  );
}

function isPageUpdatable(content) {
  // Check if the file already uses generatePageMetadata
  return !content.includes("generatePageMetadata");
}

function updatePageMetadata(filePath, slug) {
  try {
    let content = fs.readFileSync(filePath, "utf-8");

    // Skip if already updated
    if (!isPageUpdatable(content)) {
      console.log(`⏭️  Skipping ${filePath} (already updated)`);
      return;
    }

    const metadata = getMetadataForPage(slug);

    // Replace old metadata pattern
    const newContent = content
      .replace(
        /import type \{ Metadata \} from "next";/,
        'import type { Metadata } from "next";\nimport { generatePageMetadata } from "../lib/metadata";'
      )
      .replace(
        /export const metadata: Metadata = \{[\s\S]*?\};/,
        `export const metadata: Metadata = generatePageMetadata({
  title: "${metadata.title}",
  description: "${metadata.description}",
  path: "/${slug}",
  lang: "en",
  ogType: "website",
});`
      );

    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Updated: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
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

  console.log(`\n📝 Found ${pageFiles.length} page files\n`);

  let updated = 0;
  let skipped = 0;

  pageFiles.forEach((filePath) => {
    // Extract slug from path
    const relativePath = path.relative(appDir, filePath);
    const slug = relativePath
      .replace(/\/page\.tsx?$/, "")
      .replace(/\//g, "-")
      .replace(/^\[.*?\]-/, "");

    if (updatePageMetadata(filePath, slug)) {
      updated++;
    } else {
      skipped++;
    }
  });

  console.log(
    `\n✨ Summary: ${updated} updated, ${skipped} skipped\n`
  );
}

main();
