---
name: he-mobile-nav-parity
description: Enforces Hebrew mobile header parity in the Next.js web app by making /he routes use the same hamburger drawer behavior as home and forcing a black Triolla hamburger icon. Use when users report /he/* menu direction mismatch, hamburger color issues, or mobile nav inconsistency between EN and HE pages.
---

# HE Mobile Nav Parity

## Scope

Apply only in the Next.js app under `web/src`. Do not edit legacy snapshot HTML in `web/public/fragments` for this task.

## Required behavior

- All `/he/*` routes open the mobile drawer from the same side as home.
- Hebrew mobile hamburger icon stays black.
- Changes must be centralized in shared files, not per-page overrides.

## Edit points

1. `web/src/components/Header.tsx`
   - Derive `isHebrew` from locale (`locale === "he"`).
   - Add shared class hooks:
     - `menutoggle is-he` for the hamburger button on HE routes.
     - `hmenumob is-he` for the mobile drawer container on HE routes.

2. `web/src/app/globals.css`
   - Keep mobile drawer positioning/transform rules in one place.
   - Add HE-specific selectors for shared hooks (`.hmenumob.is-he`, `.menutoggle.is-he`).
   - Ensure icon color is black at hamburger breakpoints (`max-width: 1023px`), not only phone breakpoint.

## Validation checklist

- Open `/he/fintech-finance` on mobile viewport and confirm:
  - Hamburger icon is black.
  - Drawer opens from expected home-matching side.
- Recheck one non-HE route to avoid regression.
- Run lints for edited files.

