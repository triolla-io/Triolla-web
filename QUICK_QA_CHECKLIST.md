# 🚀 Quick QA Checklist - Before GitHub Deployment

**Total Routes: 173 (86 unique sections × 2 languages)**

---

## 🏠 Core Pages

- [ ] `/` - Home (English)
- [ ] `/he` - Home (Hebrew)
- [ ] `/about-us` - About (English)
- [ ] `/he/about-us` - About (Hebrew)
- [ ] `/technology` - Technology (English)
- [ ] `/he/technology` - Technology (Hebrew)

---

## 🛠️ Services (25 services × 2 languages)

**Main Service Pages:**
- [ ] `/services` - Services Index
- [ ] `/he/services` - Services Index (Hebrew)

**Service Categories (Test 3-5 representative):**
- [ ] `/services-product-ux-ui-design` (English)
- [ ] `/he/services-product-ux-ui-design` (Hebrew)
- [ ] `/services-ai-automation` (English)
- [ ] `/services-wireframing` (English)
- [ ] `/services-prototyping` (English)
- [ ] `/services/[slug]` - Dynamic service detail page

---

## 📝 Blog (101 posts × 2 languages)

**Blog Index:**
- [ ] `/blog` - Blog listing
- [ ] `/he/blog` - Blog listing (Hebrew)

**Blog Post Routes (Test 5+ posts):**
- [ ] `/blog/10-principles-for-using-color-in-ux-ui-design`
- [ ] `/blog/amazon-unveils-a-fresh-modern-design-for-the-prime-video-app`
- [ ] `/blog/how-user-experience-design-drives-startup-success-tips-for-building-winning-digital-products`
- [ ] `/blog/revolutionizing-healthcare-with-ux-design`
- [ ] `/blog/why-is-ux-ui-created-as-a-team-effort`
- [ ] `/he/blog/[slug]` - Dynamic Hebrew blog posts

---

## 🎯 Industry Solutions (8 × 2 languages)

- [ ] `/fintech-finance` (English)
- [ ] `/he/fintech-finance` (Hebrew)
- [ ] `/gaming` (English)
- [ ] `/medical-healthcare` (English)
- [ ] `/agritech` (English)
- [ ] `/cyber-security` (English)
- [ ] `/saas-platforms` (English)
- [ ] `/mobile-apps` (English)

---

## 💼 Business Pages (6 pages × 2 languages)

- [ ] `/b2b` - B2B (English)
- [ ] `/b2c` - B2C (English)
- [ ] `/contact-us` - Contact (English)
- [ ] `/careers` - Careers (English)
- [ ] `/portfolio-page` - Portfolio (English)
- [ ] `/startups-tech` - Startups (English)

---

## 🎨 Design Showcase (3 pages)

- [ ] `/dashboard-design` - Dashboard (English)
- [ ] `/branding-studio` - Branding (English)
- [ ] `/device-iot` - IoT Device (English)

---

## ⚙️ Meta Pages (3 pages × 2 languages)

- [ ] `/privacy-policy` - Privacy Policy (English)
- [ ] `/terms-of-use` - Terms (English)
- [ ] `/accessibility-statement` - Accessibility (English)

---

## 🧪 Testing Checklist

### For Each Route Test:

- [ ] Page loads without 404 errors
- [ ] CSS/images load (check Network tab in DevTools)
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] Interactive features work:
  - [ ] Carousels rotate properly
  - [ ] Accordions expand/collapse
  - [ ] Scroll animations trigger
  - [ ] Forms don't error
  - [ ] Links work (internal & external)
- [ ] No console errors (`F12` → Console tab)
- [ ] Hebrew pages display text correctly (right-to-left)
- [ ] Language switcher works (toggle /he)

---

## 📝 Testing Notes

**Quick Test Command:**
```bash
cd web
npm run dev
# Visit each URL and test above items
```

**Test Sample Routes (minimum):**
1. Home pages (/ & /he)
2. About pages
3. 2-3 different services
4. 3-5 blog posts
5. 1-2 industry pages
6. Contact form
7. Footer links (privacy, terms)

---

## ✅ Approval Checklist

- [ ] All critical routes tested and working
- [ ] No 404 errors
- [ ] No console errors
- [ ] Bilingual switching works
- [ ] Assets load correctly
- [ ] Ready for deployment

---

## 🚀 Deployment Steps (After Approval)

```bash
# From html-to-react root:
cd web

# Build for production
npm run build

# Push to GitHub
git add -A
git commit -m "QA approved: all routes tested and working"
git push origin main
```

---

**Generated:** 2026-03-31  
**Routes:** 173 total (86 unique + languages)  
**Status:** Ready for QA
