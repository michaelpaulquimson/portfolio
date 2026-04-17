# Portfolio Redesign — Design Spec

**Date:** 2026-04-17
**Status:** Approved

---

## 1. Overview

A full architecture-first rebuild of the portfolio website. Every section gets a new layout and visual design. Data and business logic are preserved; components, CSS, and structure are rebuilt from scratch.

**Goals:**
- Elevate the UI to a premium, production-grade level
- Improve TypeScript strictness, accessibility, and performance
- Bring the codebase in line with industry best practices
- Update all documentation

---

## 2. Design Decisions

| Decision | Choice |
|---|---|
| Overall direction | Premium Dark |
| Accent color | Cyber Blue — `#00FFFF` primary, `#0080FF` secondary |
| Background | Deep space black — `#050510` |
| Heading font | Space Grotesk (weights 300–700) |
| Body / label font | JetBrains Mono (weights 300–600) |
| Hero layout | Centered cinematic — radial glow orb behind name |
| Navigation | Right dot nav — minimal dots, glowing active state, labels on hover |
| Tools placement | Compact collapsible section — collapsed by default |

---

## 3. Design Tokens

Defined in `src/constants/designTokens.ts` and mirrored as CSS custom properties in `src/index.css`.

```
--bg-base:           #050510
--bg-surface:        rgba(255,255,255,0.02)
--bg-glass:          rgba(0,255,255,0.04) + backdrop-filter: blur(12px)
--accent-primary:    #00FFFF
--accent-secondary:  #0080FF
--accent-glow:       rgba(0,255,255,0.25)
--text-primary:      #FFFFFF
--text-secondary:    rgba(255,255,255,0.45)
--text-dim:          rgba(255,255,255,0.25)
--border-subtle:     rgba(255,255,255,0.06)
--border-accent:     rgba(0,255,255,0.15)
--grid-line:         rgba(0,255,255,0.04)
--radius-sm:         4px
--radius-md:         8px
--radius-lg:         12px
--transition-fast:   150ms ease-out
--transition-normal: 300ms cubic-bezier(0.4,0,0.2,1)
--transition-slow:   500ms cubic-bezier(0.4,0,0.2,1)
```

---

## 4. Page Structure

Four sections in a single-page scroll layout. No routing changes.

```
01  Hero        — Full viewport, centered cinematic
02  Resume      — Vertical timeline + skills grid
03  Projects    — Featured card + masonry grid + modal
04  Tools       — Compact collapsible accordion
```

Global: right dot navigation, subtle grid background pattern, custom cyan scrollbar.

---

## 5. Section Designs

### 5.1 Hero

**Layout:** Full viewport, content centered horizontally and vertically.

**Elements:**
- Grid background overlay (CSS, `--grid-line` opacity)
- Radial glow orb — `320px`, blurred, `--accent-primary` at 14% → transparent
- Two concentric ring circles at `200px` and `280px` diameter, 1px border
- `// Portfolio` eyebrow in JetBrains Mono, cyan, uppercase, letter-spacing 4px
- Name: "Mikee Quimson" in Space Grotesk 700, `~72px`, `letter-spacing: -2px`, white — "Quimson" in `--accent-primary`
- `36px` cyan gradient divider line
- Role subtitle: JetBrains Mono, uppercase, `--text-secondary`
- Three CTA links: "View Work" (accent filled), "Resume" + "Contact" (ghost)
- Scroll cue at bottom: thin vertical line fading to transparent + "Scroll" label

**Animations (GSAP timeline):**
1. Orb fades in (0s, 0.8s duration)
2. Eyebrow slides up + fades in (0.2s)
3. Name slides up + fades in (0.4s)
4. Divider scales in from left (0.7s)
5. Role + CTAs stagger in (0.8s)
6. Scroll cue fades in (1.2s)

### 5.2 Resume

**Layout:** Two-column grid inside a section container.

**Left column — Experience:**
- Section label in JetBrains Mono, cyan, uppercase
- Vertical timeline: cyan dot (glowing active, dimmed past) + connecting line + card
- Each card: company name (Space Grotesk 600), role (JetBrains Mono cyan), period (dim)
- Total experience calculated and shown in section header

**Right column — Skills:**
- Flex-wrap chip grid
- "Hot" chips (primary stack): cyan border + background
- Regular chips: subtle border, dim text

**Below:** Certifications strip — horizontal scroll of cert cards with issuer + date.

**Animation:** Framer Motion `whileInView` — each timeline item staggers in from left as section enters viewport.

### 5.3 Projects

**Layout:** Single-column section with filter strip, featured card, then grid.

**Filter strip:** Pill buttons — All / Full Stack / Mobile / Web / Tools. Active state: cyan border + background.

**Featured card:**
- Full-width card, `grid-template-columns: 1fr 120px`
- "★ Featured" label, project title (Space Grotesk 700), description, tech chips
- Right: project image/screenshot (lazy-loaded WebP, fallback emoji)
- Hover: subtle cyan border glow

**Project grid:**
- `grid-template-columns: repeat(3, 1fr)` on desktop, 2 on tablet, 1 on mobile
- Each card: title, tech stack label, hover lift + border glow
- Click opens modal

**Modal:**
- Fullscreen overlay with backdrop blur
- Image gallery (prev/next), full description, links (live, GitHub, App Store, Play Store)
- Escape key + click-outside to close
- Focus trap while open

**Animation:** Grid cards stagger in with Framer Motion on filter change.

### 5.4 Tools

**Layout:** Compact section, collapsed by default.

**Header row:** "// Utility Tools" label + "▾ Expand" toggle button.

**Expanded state:** Three tool cards side-by-side — QR Generator, API Tester, File Processor. Each card shows icon, name, one-line description. Full tool UI renders inside expanded card.

**Animation:** Framer Motion `AnimatePresence` height animation on expand/collapse.

### 5.5 Navigation

**Component:** `DotNavigation.tsx` (replaces `StickyNavigation.tsx`)

- Fixed right edge, vertically centered
- Four dots — one per section
- Active dot: `--accent-primary`, glow shadow, slightly larger (`9px`)
- Inactive dots: `--accent-glow` border, transparent fill
- Section labels appear to the left of each dot on hover (Framer Motion fade-in)
- Active section tracked via `IntersectionObserver` in new `useScrollSection` hook

---

## 6. New Files & Components

### New hooks (`src/hooks/`)
| File | Purpose |
|---|---|
| `useScrollSection.ts` | IntersectionObserver — returns active section ID |
| `useAnimationSequence.ts` | Wraps GSAP timeline for hero intro sequence |

### New components (`src/components/`)
| File | Purpose |
|---|---|
| `GlowOrb.tsx` | Reusable radial glow orb with rings |
| `SectionWrapper.tsx` | Framer Motion scroll-reveal wrapper for all sections |
| `DotNavigation.tsx` | Right dot nav (replaces StickyNavigation) |

### New constants (`src/constants/`)
| File | Purpose |
|---|---|
| `designTokens.ts` | Typed design token constants matching CSS variables |

### New types (`src/types/`)
| File | Purpose |
|---|---|
| `DesignSystem.ts` | Types for tokens, animation variants, section IDs |

---

## 7. Rebuilt Components

| Component | What changes |
|---|---|
| `Header.tsx` | Full rebuild — centered layout, orb, GSAP sequence |
| `Resume.tsx` | Full rebuild — timeline layout, skills grid, certs strip |
| `Projects.tsx` | Full rebuild — masonry grid, filter state, modal |
| `Portfolio.tsx` | Scroll orchestration, section refs, SectionWrapper usage |
| `DarkModeToggle.tsx` | Style refresh to match new token system |
| `ScrollToTop.tsx` | Style refresh — cyan accent |
| `index.css` | Full rewrite — new token system, grid bg, scrollbar |
| `App.css` | Trim to global resets only |

---

## 8. Animation System

| Layer | Tool | Usage |
|---|---|---|
| Hero intro sequence | GSAP timeline | Staggered entrance of orb → name → CTAs |
| Scroll reveal | Framer Motion `whileInView` | Every section fades + translates up on enter |
| Filter transitions | Framer Motion `AnimatePresence` | Cards animate out/in on category change |
| Tools accordion | Framer Motion `AnimatePresence` | Height animation on expand/collapse |
| Dot nav active state | Framer Motion | Scale + glow on active dot |
| Card hover | CSS transition | `150ms ease-out` lift + border glow |
| Reduced motion | CSS `prefers-reduced-motion` | All animations disabled for accessibility |

---

## 9. Code Quality

### TypeScript
- Strict mode enforced — no implicit `any`
- All component props fully typed via interfaces
- Design tokens exported as `const` objects with `as const`
- New hook return types explicitly declared

### Accessibility
- All interactive elements: `aria-label`, correct `role`
- Modal: `role="dialog"`, `aria-modal="true"`, focus trap, Escape key handler
- Navigation dots: `aria-label="Go to [section]"` on each button
- Color contrast: all text passes WCAG 2.1 AA (4.5:1 normal, 3:1 large)
- `prefers-reduced-motion` disables all CSS transitions and JS animations

### Performance
- `React.memo` on `ProjectCard`, `ResumeTimelineItem`
- `useCallback` on all handlers passed as props
- `React.lazy` + `Suspense` for `Projects` and `Tools` sections
- Project images: WebP format, `loading="lazy"`, explicit `width`/`height`
- No layout shifts — skeleton states for lazy sections

---

## 10. Documentation

### README.md — full rewrite
Sections: What it is · Live demo link · Tech stack · Local setup · Project structure · Customization guide (how to update projects, resume data, colors) · Deployment.

### CLAUDE.md — targeted update
Update the CSS variables section to reflect the new design token system. No structural changes.

### .gitignore
Add `.superpowers/` entry.

---

## 11. Out of Scope

- No routing changes (remains SPA)
- No backend or API changes
- No new sections beyond the 4 defined
- No light mode redesign (light mode styles will be updated to match new tokens but are not the primary focus)
- No major changes to QR Generator, API Tester, or File Processor logic

---

## 12. Success Criteria

- [ ] All 4 sections visually match the approved mockups
- [ ] Hero GSAP intro sequence plays on load
- [ ] Dot navigation tracks active section accurately
- [ ] Projects modal opens, closes with Escape, traps focus
- [ ] Tools section expands/collapses smoothly
- [ ] No TypeScript errors in strict mode
- [ ] Lighthouse score ≥ 90 across all categories
- [ ] WCAG 2.1 AA contrast passes for all text
- [ ] `prefers-reduced-motion` disables animations
- [ ] README is fully updated and accurate
