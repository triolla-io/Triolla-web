import type { Locale } from "@/lib/i18n";
import { postsHe } from "@/lib/postTranslations";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: string;
  category?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "the-essential-guide-to-designing-a-top-performing-cyber-app",
    title: "The Essential Guide to Designing a Top-Performing Cyber App",
    date: "2025-05-06",
    excerpt:
      "Recently, our team at Triolla penned an article detailing the financial side of app development. Building on that, we've now decided to create a comprehensive guide to designing top-performing cyber apps.",
    image: "/images/blog1.jpg",
    category: "Cyber Security",
    content: `
      <p>The cybersecurity landscape demands products that balance security rigor with usability. At Triolla, we've designed over 50 cyber products — from SOC dashboards to red-team tools — and we've learned what separates good design from great design in this space.</p>
      <h2>Understanding the Cyber User</h2>
      <p>Security analysts, SOC operators, and IT administrators work under pressure. Every second counts. Your UI must communicate information hierarchy instantly — critical alerts should never compete with routine logs for visual attention.</p>
      <h2>Key Principles</h2>
      <ul>
        <li>Information density done right — not cluttered, but comprehensive</li>
        <li>Dark mode by default — easier on eyes during long shifts</li>
        <li>Alert fatigue prevention — intelligent grouping and prioritization</li>
        <li>Keyboard-first navigation for power users</li>
      </ul>
      <p>The best cyber UX makes complex data feel simple, keeps users in flow, and builds trust through consistency and reliability.</p>
    `,
  },
  {
    slug: "7-emerging-ui-ux-design-trends-every-development-team-should-be-aware-of",
    title: "7 Emerging UI/UX Design Trends Every Development Team Should Be Aware Of",
    date: "2025-05-06",
    excerpt:
      "As technology progresses, so does the arsenal of tools and techniques at the disposal of UX designers. Staying ahead of the curve is essential for building products that resonate.",
    image: "/images/blog2.jpg",
    category: "Design Trends",
    content: `
      <p>The world of UI/UX design is constantly evolving. Here are 7 trends every development team should know about heading into 2025.</p>
      <h2>1. AI-Assisted Design</h2>
      <p>AI tools like Figma AI, Midjourney, and custom GPT integrations are accelerating wireframing, user research synthesis, and design system maintenance.</p>
      <h2>2. Spatial Computing Interfaces</h2>
      <p>With the rise of AR/VR headsets, designers are now building for 3D space — requiring new mental models and interaction paradigms.</p>
      <h2>3. Micro-Interactions Matter More Than Ever</h2>
      <p>Users notice the small stuff. Thoughtful micro-interactions build trust, delight users, and reduce cognitive load.</p>
      <h2>4. Variable Fonts & Typographic Expression</h2>
      <p>Typography is no longer just a delivery mechanism for content — it's part of the brand identity and UI itself.</p>
      <h2>5. Brutalist Minimalism</h2>
      <p>Clean, raw, unapologetic design that strips away decoration and lets function lead.</p>
      <h2>6. Accessibility-First Design</h2>
      <p>WCAG 2.2 compliance is becoming a baseline, not a checkbox. Teams building for global markets must prioritize inclusive design.</p>
      <h2>7. Motion as Communication</h2>
      <p>Animation is moving from decorative to functional — guiding users, communicating state, and building narrative.</p>
    `,
  },
  {
    slug: "navigating-the-future-of-ux-design",
    title: "Radio Button - Episode 122: From Freelancer to a Successful Business",
    date: "2025-05-06",
    excerpt:
      "Design had always fascinated him, and he believed in the power of visual language. However, he quickly realized that freelancing was not quite what he imagined.",
    image: "/images/blog3.jpg",
    category: "Podcast",
    content: `
      <p>In this episode of Radio Button, we sit down with Triolla's founder to explore the journey from solo freelancer to running a leading product design studio.</p>
      <h2>The Early Days</h2>
      <p>Starting as a freelance designer, the path was anything but straight. Building a reputation, finding the right clients, and developing a unique point of view took years of iteration.</p>
      <h2>Building a Team</h2>
      <p>The transition from "me" to "we" is one of the most challenging shifts any creative entrepreneur faces. Learning to delegate, trust your team, and build culture while maintaining quality standards.</p>
      <h2>What Makes a Studio Successful</h2>
      <p>Specialization matters. Triolla's focus on complex B2B and enterprise product design — particularly in cyber, fintech, and SaaS — created a defensible market position.</p>
    `,
  },
  {
    slug: "a-comprehensive-guide-to-mastering-mobile-app-design-for-israeli-startups-corporates",
    title: "A Comprehensive Guide to Mastering Mobile App Design for Israeli Startups & Corporates",
    date: "2025-05-13",
    excerpt:
      "Recently, our team at Triolla penned an article detailing the financial side of app development. Building on that, we've created a guide specifically for Israeli startups.",
    image: "/images/blog4.jpg",
    category: "Mobile Apps",
    content: `
      <p>Israeli startups are known for moving fast and thinking global from day one. But moving fast without a solid UX foundation often means costly redesigns down the road.</p>
      <h2>The Israeli Startup Advantage</h2>
      <p>Israeli product teams are unusually technical, which creates both opportunity and risk. Technical founders often undervalue UX early — until retention metrics don't match acquisition spend.</p>
      <h2>Mobile-First Is Table Stakes</h2>
      <p>In 2025, mobile is not an afterthought. For consumer-facing products, mobile conversion rates directly determine company survival. For B2B tools, mobile companions increase adoption of desktop platforms.</p>
      <h2>Localization Without Compromise</h2>
      <p>Designing for both Hebrew (RTL) and English markets requires a design system that handles bidirectionality gracefully, not as an afterthought.</p>
    `,
  },
  {
    slug: "triolla-an-industry-leader-is-actually-a-boutique-ux-studio",
    title: "Triolla: An Industry Leader is Actually a Boutique UX Studio",
    date: "2025-05-13",
    excerpt:
      "How does a boutique studio consistently win work against larger agencies? The answer lies in deep specialization, senior talent, and a culture of craft.",
    image: "/images/blog5.jpg",
    category: "Company",
    content: `
      <p>At Triolla, we've built something unusual: a studio that delivers enterprise-grade design work with the agility and personal attention of a boutique.</p>
      <h2>What "Boutique" Really Means</h2>
      <p>It doesn't mean small projects or junior talent. It means every engagement gets senior attention. It means the person who pitches is the person who designs. It means radical accountability.</p>
      <h2>Why We Stay Small on Purpose</h2>
      <p>Growth for growth's sake dilutes quality. We've turned down projects that didn't fit our specialization. We've maintained a senior-heavy team ratio. This is by design.</p>
      <h2>The Triolla Model</h2>
      <p>Deep domain expertise in cyber, fintech, and complex B2B SaaS. A multidisciplinary team spanning UX research, UI design, motion, and front-end dev. The ability to embed seamlessly into client teams.</p>
    `,
  },
  {
    slug: "ux-is-life-design-it-for-humans",
    title: "UX is Life, Design it for Humans.",
    date: "2025-05-13",
    excerpt:
      "Great UX is not just a business advantage — it's a moral imperative. Products that respect users' time, cognitive load, and goals are products that win in the long run.",
    image: "/images/blog1.jpg",
    category: "UX Design",
    content: `
      <p>Design is not decoration. It is the infrastructure of human-computer interaction — and when done poorly, it costs people time, money, and sometimes even safety.</p>
      <h2>The Human Cost of Bad UX</h2>
      <p>Think about the last time you abandoned a form because it was confusing. Or couldn't find the setting you needed. Or got an error message that told you nothing. These aren't minor annoyances — they erode trust and relationships.</p>
      <h2>Designing for Real People</h2>
      <p>The best UX comes from radical empathy. Not personas built from assumptions, but research rooted in real observation. Watching users struggle is humbling and revealing.</p>
      <h2>Simplicity is Hard Work</h2>
      <p>Every unnecessary element is a choice to not remove it. True simplicity requires discipline, iteration, and the courage to cut beloved features that don't serve the user.</p>
    `,
  },
  {
    slug: "f35-ux-vertigo",
    title: "F35 UX Vertigo",
    date: "2025-05-13",
    excerpt:
      "What can the most advanced fighter jet in the world teach us about UX design? More than you'd think.",
    image: "/images/blog2.jpg",
    category: "Design Thinking",
    content: `
      <p>The F-35 fighter jet cockpit is one of the most complex interfaces ever designed. And yet, pilots learn to operate it with precision under extreme stress. This is a masterclass in UX under constraints.</p>
      <h2>Information Hierarchy Under Pressure</h2>
      <p>In combat, a pilot cannot hunt for information. The HUD (heads-up display) design is built on radical hierarchy — the most critical information is always in peripheral vision.</p>
      <h2>Reducing Cognitive Load</h2>
      <p>The F-35's interface designers spent years reducing the number of decisions a pilot needs to make consciously. Automation handles routine tasks; the pilot focuses on judgment calls.</p>
      <h2>Applying This to Product Design</h2>
      <p>Your users aren't flying at Mach 1.6, but they're still operating under cognitive load. Every design decision that requires unnecessary thought is a tax on their performance.</p>
    `,
  },
  {
    slug: "ux-in-medtech-when-trust-is-a-matter-of-life-and-death",
    title: "UX in MedTech: When Trust is a Matter of Life and Death",
    date: "2025-05-13",
    excerpt:
      "In healthcare and medical devices, a UX failure is not just a bad experience — it can cause real harm. The stakes demand a higher standard of design.",
    image: "/images/blog3.jpg",
    category: "Medical & Healthcare",
    content: `
      <p>Medical UX carries unique responsibility. When a nurse misreads a dosage on an infusion pump because of poor interface design, that is a design failure with real consequences.</p>
      <h2>The Regulatory Landscape</h2>
      <p>FDA guidance on human factors, IEC 62366 usability engineering standards, and ISO 14971 risk management all have direct implications for UX design in medical devices and software.</p>
      <h2>Trust Through Consistency</h2>
      <p>Medical users develop muscle memory. A UI change, even an improvement, can break trained workflows and introduce risk. Evolution must be gradual and validated.</p>
      <h2>Designing for High-Stakes Alerts</h2>
      <p>Alert design in medical contexts is a specialized discipline. Too many alerts creates fatigue and ignored warnings. Too few creates blind spots. Finding the right threshold is a research and design challenge.</p>
    `,
  },
  {
    slug: "the-fintech-ux-playbook",
    title: "The Fintech UX Playbook",
    date: "2025-05-13",
    excerpt:
      "Fintech is where UX meets regulation, trust, and complexity. Building financial products users actually love requires mastering this unique intersection.",
    image: "/images/blog4.jpg",
    category: "Fintech & Finance",
    content: `
      <p>Financial products carry a unique burden: users must trust them with their money, understand complex information, and navigate regulatory requirements — all through a screen.</p>
      <h2>Building Trust Through Design</h2>
      <p>Trust in fintech is built through consistency, transparency, and reassurance. Users need to feel confident that the system works, that their money is safe, and that they understand what's happening.</p>
      <h2>Simplifying Complexity</h2>
      <p>Financial data is inherently complex. Great fintech UX doesn't hide that complexity — it creates progressive disclosure paths that give users the right information at the right time.</p>
      <h2>Onboarding in Regulated Markets</h2>
      <p>KYC, AML, and compliance requirements create friction. The best fintech onboarding turns regulatory necessity into an opportunity to build trust rather than a bureaucratic hurdle.</p>
    `,
  },
  {
    slug: "level-up-your-gaming-app-with-expert-ux-tips",
    title: "Level Up Your Gaming App: Expert UX Tips to Boost User Engagement and Retention",
    date: "2025-05-14",
    excerpt:
      "Gaming UX is a competitive sport. Players are sophisticated, expectations are high, and the difference between a sticky game and an abandoned one often comes down to interface decisions.",
    image: "/images/blog5.jpg",
    category: "Gaming",
    content: `
      <p>The gaming industry is one of the most UX-sophisticated markets in the world. Gamers develop strong interface literacy and will quickly abandon an app that doesn't meet their expectations.</p>
      <h2>First 60 Seconds: The Tutorial Problem</h2>
      <p>Most games lose players in the first minute. The onboarding tutorial must teach mechanics through play, not explanation. Show, don't tell — let users experience success early.</p>
      <h2>Feedback Loops and Dopamine</h2>
      <p>Game UX is built on feedback loops. Every action should have clear, satisfying feedback. Sound, animation, haptics — all working together to create a sense of cause and effect.</p>
      <h2>Monetization UX Without Destroying Fun</h2>
      <p>The best monetization UX presents paid options as enhancements, not gates. When players feel respected rather than manipulated, lifetime value increases.</p>
    `,
  },
];

function applyPostLocale(post: BlogPost, locale: Locale): BlogPost {
  if (locale === "en") return post;
  const he = postsHe[post.slug];
  if (!he) return post;
  return { ...post, title: he.title, excerpt: he.excerpt, content: he.content };
}

export function getPostBySlug(slug: string, locale: Locale = "en"): BlogPost | undefined {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return undefined;
  return applyPostLocale(post, locale);
}

export function getAllPosts(locale: Locale = "en"): BlogPost[] {
  return blogPosts.map((p) => applyPostLocale(p, locale));
}
