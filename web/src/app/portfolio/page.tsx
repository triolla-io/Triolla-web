import Image from "next/image";
import Link from "next/link";
import Banner from "@/components/Banner";
import ContactSection from "@/components/ContactSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import { companyTicker, whyChooseUs } from "@/lib/pages";

interface PortfolioEntry {
  id: number;
  logo: string;
  logoAlt: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  tags: string[];
  even: boolean;
}

const portfolioEntries: PortfolioEntry[] = [
  {
    id: 1,
    logo: "/images/armis_logo.svg",
    logoAlt: "Armis",
    title: "Armis chose us to lead the complete redesign of their platform and build a unified design system across all their products",
    text: "Over the course of a year, with two dedicated designers deeply embedded in their teams, we built a scalable design system and completely redesigned their security management platform. We know the users, the lingo, and the pain points.",
    image: "/images/armis_img.svg",
    imageAlt: "Armis platform redesign",
    tags: ["Cyber Security", "SaaS", "Design System"],
    even: false,
  },
  {
    id: 2,
    logo: "/images/suridata_logo.svg",
    logoAlt: "Suridata",
    title: "Shaping the future of digital healthcare with user-centered design — trusted by top medical brands to deliver clarity, care, and compliance.",
    text: "We know the users, the lingo, and the pain points. Avoid the headaches of working with a generic agency and partner with a team that speaks your language fluently.",
    image: "/images/suridata_img.svg",
    imageAlt: "Suridata design",
    tags: ["Medical", "UX Research", "B2B"],
    even: true,
  },
  {
    id: 3,
    logo: "/images/cyngular_logo.svg",
    logoAlt: "Cyngular",
    title: "Building enterprise-grade SaaS platforms that scale with your business and delight your users — from onboarding to advanced analytics.",
    text: "From complex dashboards to intuitive workflows — we design and develop full-stack products that enterprise teams love using every day.",
    image: "/images/cyngular_img.svg",
    imageAlt: "Cyngular platform",
    tags: ["SaaS", "Enterprise", "Platform"],
    even: false,
  },
  {
    id: 4,
    logo: "/images/safe_breach_logo.svg",
    logoAlt: "Safe Breach",
    title: "Redesigning cyber attack simulation to be as intuitive as the attacks it prevents — clarity and power, combined.",
    text: "Cybersecurity tools need to be both powerful and usable. We helped SafeBreach create an interface their red teams love.",
    image: "/images/saf_breach_logo.svg",
    imageAlt: "Safe Breach design",
    tags: ["Cyber Security", "Platform", "Dashboard"],
    even: true,
  },
  {
    id: 5,
    logo: "/images/sqlink_icon.png",
    logoAlt: "SQLink",
    title: "A full product design overhaul for one of Israel's leading professional services platforms.",
    text: "From user research to high-fidelity design — we created a modern, scalable product experience that serves both clients and recruiters.",
    image: "/images/techmid4.png",
    imageAlt: "SQLink redesign",
    tags: ["Marketplace", "B2B", "Full Redesign"],
    even: false,
  },
];

const industryLinks = [
  { label: "Mobile Apps", href: "/portfolio/" },
  { label: "Fintech & Finance", href: "/portfolio/" },
  { label: "IOT & Devices", href: "/portfolio/" },
  { label: "SaaS", href: "/portfolio/" },
  { label: "Gaming", href: "/portfolio/" },
  { label: "Medical", href: "/portfolio/" },
  { label: "Agritech", href: "/portfolio/" },
];

export default function PortfolioPage() {
  return (
    <>
      {/* Banner */}
      <Banner
        subText="Product design for"
        title="Portfolio"
        boldText="Partner with product design experts who get it."
        shortText="At Triolla, we speak fluent cybersecurity — from SOC dashboards to red team tools. We know the users, the lingo, and the pain points."
        buttonText="Partner with us"
        buttonHref="#contactus"
      />

      {/* ===== COMPANY TICKER ===== */}
      <section className="bg-black py-5 overflow-hidden">
        <div className="ticker-track">
          {[...companyTicker, ...companyTicker].map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center px-8 text-[18px] lg:text-[22px] text-white font-light whitespace-nowrap"
            >
              {name}
              <span className="inline-block w-2 h-2 rounded-full bg-[#FED125] ml-8" />
            </span>
          ))}
        </div>
      </section>

      {/* ===== PORTFOLIO LIST ===== */}
      <section className="bg-white">
        <ul className="divide-y divide-black/10">
          {portfolioEntries.map((entry) => (
            <li
              key={entry.id}
              className={`flex flex-col ${entry.even ? "lg:flex-row-reverse" : "lg:flex-row"} items-center min-h-[600px]`}
            >
              {/* Image half */}
              <div className="w-full lg:w-1/2 overflow-hidden min-h-[320px] lg:min-h-[600px] relative">
                <Image
                  src={entry.image}
                  alt={entry.imageAlt}
                  fill
                  className="object-contain p-8 lg:p-16"
                />
              </div>

              {/* Content half */}
              <div className="w-full lg:w-1/2 px-8 lg:px-[60px] xl:px-[80px] py-12 lg:py-16">
                {/* Logo */}
                <div className="mb-6 h-[50px] flex items-center">
                  <Image
                    src={entry.logo}
                    alt={entry.logoAlt}
                    width={160}
                    height={50}
                    className="max-h-[44px] w-auto object-contain"
                  />
                </div>

                {/* Title */}
                <h3 className="text-[22px] lg:text-[28px] xl:text-[32px] font-bold text-black leading-tight mb-5">
                  {entry.title}
                </h3>

                {/* Text */}
                <p className="text-[16px] lg:text-[18px] text-black/70 leading-relaxed mb-8">
                  {entry.text}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-4 py-1.5 text-[13px] font-medium text-black border border-black/20 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Partner CTA */}
        <div className="py-16 lg:py-[80px] text-center px-6">
          <p className="text-[24px] lg:text-[32px] text-black max-w-[800px] mx-auto mb-8 font-light">
            Partner with 50+ SaaS B2B product design experts who get it.
          </p>
          <Link
            href="#contactus"
            className="pill-btn px-10 py-4 text-[18px] lg:text-[20px] font-medium text-black"
          >
            <span className="default-text">Partner with us</span>
            <span className="hover-text">Partner with us</span>
            <span className="btn-overlay" />
          </Link>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <WhyChooseUsSection
        heading={<>Why Do<br />cyber companies<br />choose us?</>}
        cards={whyChooseUs}
        variant="light"
      />

      {/* ===== INDUSTRIES ===== */}
      <section className="py-[80px] lg:py-[100px] px-6 lg:px-[60px] bg-white">
        <div className="max-w-[1400px] mx-auto text-center">
          <h3 className="text-[36px] lg:text-[48px] font-black text-black mb-12">
            Industries We Design For
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {industryLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="pill-btn px-6 py-2.5 text-[16px] font-medium text-black"
              >
                <span className="default-text">{link.label}</span>
                <span className="hover-text">{link.label}</span>
                <span className="btn-overlay" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <ContactSection />
    </>
  );
}
