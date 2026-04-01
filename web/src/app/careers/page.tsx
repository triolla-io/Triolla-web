"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import HeroJumpSvgs from "@/components/HeroJumpSvgs";
import PageBottomSection from "@/components/PageBottomSection";
import CareersImageCollage from "@/components/sections/CareersImageCollage";
import "./careers-page.css";

const jobs = [
  {
    title: "Senior Product UX/UI Designer",
    desc: "We're looking for someone with strong UX skills, Figma expertise, and experience working on complex platforms and design systems.",
  },
  {
    title: "Product Design Team Lead / Manager",
    desc: "We're looking for a Product Design Team Leader to join Triolla and lead a talented team of 3–4 designers, driving high-impact projects and shaping exceptional user experiences.",
  },
  {
    title: "Studio Manager",
    desc: "We're looking for a Studio Manager to oversee and optimize data annotation workflows, manage labeling teams, and ensure high-quality, scalable output.",
  },
  {
    title: "Project Manager",
    desc: "We're looking for a Project Manager with 2–3 years of experience to lead complex development projects from kickoff to delivery.",
  },
  {
    title: "UI/UX Product Designer",
    desc: "Triolla is looking for a talented UX/UI Designer with 1–2 years of experience to join our team and help craft beautiful, user-centered digital products.",
  },
  {
    title: "Head of Product Design",
    desc: "Senior leadership role to shape the design vision and grow the product design practice at Triolla.",
  },
  {
    title: "React / Node.js Full Stack Web Developer",
    desc: "We're looking for a skilled Full Stack Developer with expertise in React and Node.js to build and maintain high-quality web applications.",
  },
  {
    title: "Account Manager",
    desc: "Manage and support our customers in the high-tech and startup sectors, primarily in the fields of UX/UI design and product development.",
  },
  {
    title: "Sales Development Representative (SDR) – Tech & Product Design Industry",
    desc: "We're looking for a motivated SDR to identify, engage, and qualify potential clients for Triolla's product design and development services.",
  },
];

function JobCard({ title, desc }: { title: string; desc: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#B1B1B1] py-6 first:border-t first:border-[#B1B1B1]">
      <button
        type="button"
        className="w-full flex items-center justify-between text-left gap-4 cursor-pointer bg-transparent border-0 p-0"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-[20px] md:text-[24px] font-bold text-black m-0">{title}</h3>
        <span className={`flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 9L12 15L18 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="mt-4 text-[16px] md:text-[18px] text-black/65 leading-relaxed">
          <p className="mb-4">{desc}</p>
          <a
            href="mailto:jobs@triolla.io"
            className="inline-flex items-center gap-2 text-[16px] font-medium text-black underline hover:text-[#006BFF] transition-colors"
          >
            Apply → jobs@triolla.io
          </a>
        </div>
      )}
    </div>
  );
}

export default function CareersPage() {
  return (
    <div className="inner_content caeer_content">
      {/* Hero — WP portfolio_banner */}
      <section className="portfolio_banner relative bg-[#FED125] pt-[262px] pb-[201px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image src="/images/banner_grid.svg" alt="" fill className="object-cover object-top opacity-60" priority />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/portolio_layer.svg"
            alt=""
            style={{ position: "absolute", top: 0, right: 0, height: "100%", width: "auto" }}
          />
        </div>
        <div className="relative max-w-[1214px] mx-auto px-5 sm:px-[30px] md:px-[80px] lg:px-[150px]">
          <HeroJumpSvgs />
          <div className="relative text-center">
            <motion.h1
              className="font-bold text-[77px] sm:text-[96px] md:text-[138px] lg:text-[180px] xl:text-[260px] leading-[0.85] text-black text-center m-0 pb-[40px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Work. Fun.Play
            </motion.h1>
            <motion.p
              className="font-bold text-[22px] md:text-[32px] leading-[1.15] tracking-[-0.96px] text-center text-black m-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We are rapidly growing and looking for great people to join us
            </motion.p>
          </div>
        </div>
      </section>

      <ScrollReveal direction="up">
        <CareersImageCollage />
      </ScrollReveal>

      <section className="careerlist pb-[80px] md:pb-[120px]">
        <div className="carlistwrap">
          <ScrollReveal direction="up">
            <div className="carlisttop">
              <h3>
                Grow Faster,
                <br />
                Aim Higher,
                <br />
                Dream Bigger
              </h3>
              <p>our journey starts with us — let&apos;s build something extraordinary together.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <div className="max-w-[800px] mx-auto w-full">
              {jobs.map((job, i) => (
                <JobCard key={i} {...job} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <PageBottomSection />
    </div>
  );
}
