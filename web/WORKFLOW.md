# Triolla Conversion Workflow

## Phase 1 — Setup (run once per project)

| Command | What it does |
|---|---|
| `/setup-tokens` | Reads WP CSS → extracts design values → writes `tailwind.config.ts` |
| `/setup-components` | Scaffolds `src/components/` folder structure + creates `AnimatedSection` base |

---

## Phase 2 — Per-page conversion

**The easy path:** `/convert-page {slug}` runs the entire pipeline in order, pausing for decisions.

**The pipeline steps in order:**

| Step | Command | What it does |
|---|---|---|
| 1 | `/extract files/pages/{slug}.html [section]` | Pull raw WP section HTML verbatim |
| 2 | `/tailwind {slug} {section}` | Convert WP classes → Tailwind utility classes |
| 3 | `/component {Name}` | Extract any repeating patterns into shared components |
| 4 | `/animate {slug} [section or 'all']` | Add Framer Motion scroll/load animations |
| 5 | `/responsive {slug}` | Audit and fix mobile/responsive behavior |
| 6 | `/qa {slug}` | Final quality check vs. original WP page |

---

## Source files

- WP HTML pages → `files/pages/`
- WP theme CSS → `files/themes/triolla/`

## Key references

| File | Purpose |
|---|---|
| `.claude/commands/references/design-system.md` | Full token dictionary |
| `.claude/commands/references/animation-patterns.md` | WP → Framer Motion mappings |
| `.claude/commands/references/wp-structure.md` | WP boilerplate & section patterns |
| `.claude/commands/references/component-map.md` | All built components so far |

---

## Typical session

1. Start a new page: `/convert-page {slug}`
2. Use individual commands to redo specific steps if something needs fixing
