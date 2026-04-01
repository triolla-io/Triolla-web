import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-lets-talk-microcopy-how-small-words-create-a-big-user-experience-in-ux-ui-design-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-lets-talk-microcopy-how-small-words-create-a-big-user-experience-in-ux-ui-design | Triolla",
  description: "Learn more about blog-lets-talk-microcopy-how-small-words-create-a-big-user-experience-in-ux-ui-design at Triolla.",
  path: "/blog-lets-talk-microcopy-how-small-words-create-a-big-user-experience-in-ux-ui-design",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="lets-talk-microcopy-how-small-words-create-a-big-user-experience-in-ux-ui-design" deps={deps} />;
}
