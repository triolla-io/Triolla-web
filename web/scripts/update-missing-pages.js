#!/usr/bin/env node
/**
 * Update remaining 17 pages with proper SEO metadata
 */

const fs = require("fs");
const path = require("path");

const pagesToUpdate = [
  {
    path: "app/about/page.tsx",
    title: "About Triolla | Our Story & Team",
    description: "Meet Triolla - a team of experienced UX/UI designers dedicated to creating world-class digital products and solutions.",
  },
  {
    path: "app/services-back-end-dev/page.tsx",
    title: "Back-End Development Services | Triolla",
    description: "Expert back-end development services to build scalable, robust APIs and server-side solutions for your products.",
  },
  {
    path: "app/services-character-design/page.tsx",
    title: "Character Design Services | Triolla",
    description: "Professional character design services for games, apps, and digital media. Create memorable characters.",
  },
  {
    path: "app/services-creative-concept/page.tsx",
    title: "Creative Concept Development | Triolla",
    description: "Innovative creative concept development to bring your ideas to life with strategic and artistic direction.",
  },
  {
    path: "app/services-design-system-creation/page.tsx",
    title: "Design System Creation | Triolla",
    description: "Build scalable design systems for consistent and efficient product development across teams.",
  },
  {
    path: "app/services-front-end-dev/page.tsx",
    title: "Front-End Development Services | Triolla",
    description: "Expert front-end development to bring your designs to life with modern technologies and best practices.",
  },
  {
    path: "app/services-logo-design/page.tsx",
    title: "Logo Design Services | Triolla",
    description: "Custom logo design that captures your brand identity and makes you stand out from competitors.",
  },
  {
    path: "app/services-motion-design/page.tsx",
    title: "Motion Design & Animation Services | Triolla",
    description: "Engaging motion design and animations to enhance user experience and capture attention.",
  },
  {
    path: "app/services-motion-design-old/page.tsx",
    title: "Motion Design (Legacy) | Triolla",
    description: "Professional motion design services for video, web, and interactive applications.",
  },
  {
    path: "app/services-presentations/page.tsx",
    title: "Presentation Design Services | Triolla",
    description: "Stunning presentation design that communicates your ideas clearly and professionally.",
  },
  {
    path: "app/services-product-stars/page.tsx",
    title: "Product Stars Service | Triolla",
    description: "Innovative product optimization service to make your digital product shine and succeed in the market.",
  },
  {
    path: "app/services-product-ux-ui-design/page.tsx",
    title: "Product UX/UI Design Services | Triolla",
    description: "Complete UX/UI design for digital products from concept to launch with user-centered approach.",
  },
  {
    path: "app/services-prototyping/page.tsx",
    title: "Prototyping Services | Triolla",
    description: "Interactive prototypes to validate design concepts before development and get stakeholder buy-in.",
  },
  {
    path: "app/services-ui-design/page.tsx",
    title: "UI Design Services | Triolla",
    description: "Beautiful and functional user interface design that users love and engage with.",
  },
  {
    path: "app/services-user-testing/page.tsx",
    title: "User Testing Services | Triolla",
    description: "Comprehensive user testing to validate assumptions and improve your product based on real user feedback.",
  },
  {
    path: "app/services-ux-research/page.tsx",
    title: "UX Research Services | Triolla",
    description: "In-depth user research to inform better product design decisions and understand user needs.",
  },
  {
    path: "app/services-wireframing/page.tsx",
    title: "Wireframing Services | Triolla",
    description: "Professional wireframing to visualize your product structure and user flows before design.",
  },
];

function updatePage(filePath, title, description) {
  const fullPath = path.join("/Users/ariell/html-to-react/web", filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, "utf-8");

  // Skip if already updated
  if (content.includes("generatePageMetadata")) {
    console.log(`⏭️  Already updated: ${filePath}`);
    return false;
  }

  // Get the component name from the directory
  const componentName = filePath
    .split("/")
    .slice(-2)[0]
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join("")
    .replace(/([A-Z])/g, (match) => match)
    + "Client";

  // Create the updated content
  const newContent = `import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ${componentName} } from "./${componentName}";

export const metadata: Metadata = generatePageMetadata({
  title: "${title}",
  description: "${description}",
  path: "/${filePath.split("/").slice(1, -1).join("/")}",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <${componentName} />;
}
`;

  fs.writeFileSync(fullPath, newContent);
  console.log(`✅ Updated: ${filePath}`);
  return true;
}

console.log("\n📝 Updating 17 remaining pages...\n");

let updated = 0;
pagesToUpdate.forEach(({ path, title, description }) => {
  if (updatePage(path, title, description)) {
    updated++;
  }
});

console.log(`\n✨ Summary: ${updated} pages updated\n`);
EOF
node /Users/ariell/html-to-react/web/scripts/update-missing-pages.js
