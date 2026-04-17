# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full architecture-first rebuild of the portfolio — Premium Dark, Cyber Blue (cyan/electric blue), Space Grotesk + JetBrains Mono, centered cinematic hero, right dot navigation, and a compact tools accordion.

**Architecture:** Replace the current component-per-file structure with a shared design token system, new primitive components (GlowOrb, SectionWrapper, DotNavigation), and rebuilt section components. All existing data (projects, resume content) is preserved — only layouts, styles, and component structure change. ThemeContext and all tool logic are kept as-is.

**Tech Stack:** React 19, TypeScript 5.8, Vite 7, Framer Motion 12, GSAP 3, Lucide React, react-icons.

**Verification method:** No test framework is present; use `npm run build` (runs `tsc -b && vite build`) to verify type correctness after each task, and `npm run dev` for visual browser verification. Run `npm run lint` before each commit.

---

## File Map

**Create:**
- `src/constants/designTokens.ts` — typed design token constants
- `src/hooks/useScrollSection.ts` — IntersectionObserver active section tracker
- `src/components/GlowOrb.tsx` + `GlowOrb.css`
- `src/components/SectionWrapper.tsx`
- `src/components/DotNavigation.tsx` + `DotNavigation.css`
- `src/components/ToolsSection.tsx` + `ToolsSection.css`

**Full rewrite:**
- `src/index.css` — new design token CSS custom properties
- `src/App.css` — trim to global resets only
- `src/components/Header.tsx` + `Header.css` — centered cinematic hero
- `src/components/Resume.tsx` + `Resume.css` — timeline layout
- `src/components/Projects.tsx` + `Projects.css` — masonry + filter + modal
- `src/components/Portfolio.tsx` + `Portfolio.css` — scroll orchestration
- `src/components/DarkModeToggle.tsx` + `DarkModeToggle.css` — style refresh
- `src/components/ScrollToTop.tsx` + `ScrollToTop.css` — style refresh

**Update docs:**
- `README.md`
- `CLAUDE.md` — update CSS variables section

**Keep as-is:**
- `src/contexts/ThemeContext.tsx`
- `src/hooks/useGSAP.ts`
- `src/types/Project.ts`
- `src/constants/projects.ts`
- `src/components/QRGenerator.tsx`
- `src/components/APITester.tsx`
- `src/components/FileProcessor.tsx`

---

## Task 1: Design System Foundation

**Files:**
- Create: `src/constants/designTokens.ts`
- Rewrite: `src/index.css`
- Rewrite: `src/App.css`

- [ ] **Step 1: Create `src/constants/designTokens.ts`**

```typescript
export const colors = {
  bgBase: '#050510',
  bgSurface: 'rgba(255,255,255,0.02)',
  bgGlass: 'rgba(0,255,255,0.04)',
  accentPrimary: '#00FFFF',
  accentSecondary: '#0080FF',
  accentGlow: 'rgba(0,255,255,0.25)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.45)',
  textDim: 'rgba(255,255,255,0.25)',
  borderSubtle: 'rgba(255,255,255,0.06)',
  borderAccent: 'rgba(0,255,255,0.15)',
  gridLine: 'rgba(0,255,255,0.04)',
} as const

export const typography = {
  fontDisplay: "'Space Grotesk', -apple-system, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",
} as const

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '5rem',
} as const

export const radii = {
  sm: '4px',
  md: '8px',
  lg: '12px',
} as const

export const transitions = {
  fast: '150ms ease-out',
  normal: '300ms cubic-bezier(0.4,0,0.2,1)',
  slow: '500ms cubic-bezier(0.4,0,0.2,1)',
} as const

export const sections = ['hero', 'resume', 'projects', 'tools'] as const
export type SectionId = typeof sections[number]

export const sectionLabels: Record<SectionId, string> = {
  hero: 'Hero',
  resume: 'Resume',
  projects: 'Projects',
  tools: 'Tools',
}
```

- [ ] **Step 2: Rewrite `src/index.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

:root {
  --bg-base: #050510;
  --bg-surface: rgba(255, 255, 255, 0.02);
  --bg-glass: rgba(0, 255, 255, 0.04);
  --accent-primary: #00ffff;
  --accent-secondary: #0080ff;
  --accent-glow: rgba(0, 255, 255, 0.25);
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.45);
  --text-dim: rgba(255, 255, 255, 0.25);
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-accent: rgba(0, 255, 255, 0.15);
  --grid-line: rgba(0, 255, 255, 0.04);

  --font-display: 'Space Grotesk', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 5rem;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --transition-fast: 150ms ease-out;
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);

  --max-width: 1100px;
  --section-padding-x: 1.5rem;
  --section-padding-y: 6rem;
}

[data-theme='light'] {
  --bg-base: #f8f9ff;
  --bg-surface: rgba(0, 0, 0, 0.02);
  --bg-glass: rgba(0, 80, 255, 0.04);
  --accent-primary: #0066ff;
  --accent-secondary: #00ccff;
  --accent-glow: rgba(0, 102, 255, 0.2);
  --text-primary: #0a0a1a;
  --text-secondary: rgba(10, 10, 26, 0.55);
  --text-dim: rgba(10, 10, 26, 0.35);
  --border-subtle: rgba(0, 0, 0, 0.06);
  --border-accent: rgba(0, 102, 255, 0.2);
  --grid-line: rgba(0, 80, 255, 0.04);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-weight: 400;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: var(--bg-base);
}
::-webkit-scrollbar-thumb {
  background: var(--border-accent);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}
```

- [ ] **Step 3: Rewrite `src/App.css`**

```css
#root {
  width: 100%;
  min-height: 100vh;
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run build
```

Expected: build succeeds (no new type errors from the CSS/token files).

- [ ] **Step 5: Commit**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio
git add src/constants/designTokens.ts src/index.css src/App.css
git commit -m "feat: add design token system and rewrite CSS foundation"
```

---

## Task 2: useScrollSection Hook

**Files:**
- Create: `src/hooks/useScrollSection.ts`

- [ ] **Step 1: Create `src/hooks/useScrollSection.ts`**

```typescript
import { useState, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { SectionId } from '../constants/designTokens'
import { sections } from '../constants/designTokens'

export type SectionRefs = Record<SectionId, RefObject<HTMLElement | null>>

export function useScrollSection(refs: SectionRefs): SectionId {
  const [activeSection, setActiveSection] = useState<SectionId>('hero')
  const observersRef = useRef<Map<SectionId, IntersectionObserver>>(new Map())

  useEffect(() => {
    const observers = observersRef.current

    sections.forEach((id) => {
      const el = refs[id].current
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { threshold: 0.4 }
      )

      observer.observe(el)
      observers.set(id, observer)
    })

    return () => {
      observers.forEach((o) => o.disconnect())
      observers.clear()
    }
  }, [refs])

  return activeSection
}
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio
git add src/hooks/useScrollSection.ts
git commit -m "feat: add useScrollSection hook with IntersectionObserver"
```

---

## Task 3: GlowOrb and SectionWrapper Primitives

**Files:**
- Create: `src/components/GlowOrb.tsx`
- Create: `src/components/GlowOrb.css`
- Create: `src/components/SectionWrapper.tsx`

- [ ] **Step 1: Create `src/components/GlowOrb.css`**

```css
.glow-orb {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
}

.glow-orb__core {
  width: var(--orb-size, 320px);
  height: var(--orb-size, 320px);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 255, 255, 0.14) 0%,
    rgba(0, 128, 255, 0.07) 40%,
    transparent 70%
  );
  filter: blur(28px);
}

.glow-orb__ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px solid var(--border-accent);
}

.glow-orb__ring--inner {
  width: calc(var(--orb-size, 320px) * 0.625);
  height: calc(var(--orb-size, 320px) * 0.625);
  opacity: 0.5;
}

.glow-orb__ring--outer {
  width: calc(var(--orb-size, 320px) * 0.875);
  height: calc(var(--orb-size, 320px) * 0.875);
  opacity: 0.25;
}
```

- [ ] **Step 2: Create `src/components/GlowOrb.tsx`**

```tsx
import React from 'react'
import './GlowOrb.css'

interface GlowOrbProps {
  size?: number
}

const GlowOrb: React.FC<GlowOrbProps> = ({ size = 320 }) => (
  <div
    className="glow-orb"
    aria-hidden="true"
    style={{ '--orb-size': `${size}px` } as React.CSSProperties}
  >
    <div className="glow-orb__core" />
    <div className="glow-orb__ring glow-orb__ring--inner" />
    <div className="glow-orb__ring glow-orb__ring--outer" />
  </div>
)

export default GlowOrb
```

- [ ] **Step 3: Create `src/components/SectionWrapper.tsx`**

```tsx
import React from 'react'
import { motion } from 'framer-motion'
import type { SectionId } from '../constants/designTokens'

interface SectionWrapperProps {
  id: SectionId
  children: React.ReactNode
  className?: string
  sectionRef?: React.RefObject<HTMLElement | null>
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  children,
  className,
  sectionRef,
}) => (
  <motion.section
    id={id}
    ref={sectionRef as React.RefObject<HTMLElement>}
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={fadeUp}
  >
    {children}
  </motion.section>
)

export default SectionWrapper
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio
git add src/components/GlowOrb.tsx src/components/GlowOrb.css src/components/SectionWrapper.tsx
git commit -m "feat: add GlowOrb and SectionWrapper primitive components"
```

---

## Task 4: DotNavigation

**Files:**
- Create: `src/components/DotNavigation.tsx`
- Create: `src/components/DotNavigation.css`

- [ ] **Step 1: Create `src/components/DotNavigation.css`**

```css
.dot-nav {
  position: fixed;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 100;
  list-style: none;
}

.dot-nav__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
}

.dot-nav__label {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-primary);
  opacity: 0.8;
  white-space: nowrap;
}

.dot-nav__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1.5px solid var(--border-accent);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition:
    width var(--transition-fast),
    height var(--transition-fast),
    background var(--transition-fast),
    box-shadow var(--transition-fast);
  flex-shrink: 0;
}

.dot-nav__dot:hover {
  border-color: var(--accent-primary);
}

.dot-nav__dot--active {
  width: 10px;
  height: 10px;
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  box-shadow: 0 0 10px var(--accent-glow);
}

@media (max-width: 768px) {
  .dot-nav {
    right: 0.75rem;
  }

  .dot-nav__label {
    display: none;
  }
}
```

- [ ] **Step 2: Create `src/components/DotNavigation.tsx`**

```tsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sections, sectionLabels } from '../constants/designTokens'
import type { SectionId } from '../constants/designTokens'
import './DotNavigation.css'

interface DotNavigationProps {
  activeSection: SectionId
}

const DotNavigation: React.FC<DotNavigationProps> = ({ activeSection }) => {
  const handleClick = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="dot-nav" aria-label="Page sections">
      {sections.map((id) => (
        <div key={id} className="dot-nav__item">
          <AnimatePresence>
            {activeSection === id && (
              <motion.span
                className="dot-nav__label"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.2 }}
              >
                {sectionLabels[id]}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            className={`dot-nav__dot${activeSection === id ? ' dot-nav__dot--active' : ''}`}
            onClick={() => handleClick(id)}
            aria-label={`Go to ${sectionLabels[id]} section`}
            aria-current={activeSection === id ? 'true' : undefined}
          />
        </div>
      ))}
    </nav>
  )
}

export default DotNavigation
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio
git add src/components/DotNavigation.tsx src/components/DotNavigation.css
git commit -m "feat: add DotNavigation component with glowing active state"
```

---

## Task 5: Hero Rebuild (Header.tsx)

**Files:**
- Rewrite: `src/components/Header.tsx`
- Rewrite: `src/components/Header.css`

- [ ] **Step 1: Rewrite `src/components/Header.css`**

```css
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-base);
}

.hero__grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: 0 var(--spacing-section-x, 1.5rem);
}

.hero__eyebrow {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent-primary);
  opacity: 0.8;
}

.hero__name {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.04em;
  line-height: 1.0;
  margin: 0;
}

.hero__name--accent {
  color: var(--accent-primary);
}

.hero__divider {
  width: 36px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 1px;
  transform-origin: left center;
}

.hero__role {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin: 0;
}

.hero__links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

.hero__cta {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast),
    box-shadow var(--transition-fast);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.hero__cta--primary {
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid var(--border-accent);
  color: var(--accent-primary);
}

.hero__cta--primary:hover {
  background: rgba(0, 255, 255, 0.18);
  box-shadow: 0 0 16px var(--accent-glow);
}

.hero__cta--ghost {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}

.hero__cta--ghost:hover {
  border-color: var(--border-accent);
  color: var(--text-primary);
}

.hero__scroll-cue {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.5625rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.hero__scroll-line {
  width: 1px;
  height: 28px;
  background: linear-gradient(to bottom, var(--accent-primary), transparent);
  opacity: 0.5;
}

@media (max-width: 480px) {
  .hero__name {
    font-size: 2.75rem;
  }

  .hero__links {
    flex-direction: column;
    align-items: center;
  }
}
```

- [ ] **Step 2: Rewrite `src/components/Header.tsx`**

```tsx
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import GlowOrb from './GlowOrb'
import './Header.css'

const Header: React.FC = () => {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const roleRef = useRef<HTMLParagraphElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [
          eyebrowRef.current,
          nameRef.current,
          dividerRef.current,
          roleRef.current,
          linksRef.current,
          scrollCueRef.current,
        ],
        { opacity: 0 }
      )

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
        .fromTo(
          nameRef.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.35
        )
        .fromTo(
          dividerRef.current,
          { opacity: 1, scaleX: 0 },
          { opacity: 1, scaleX: 1, duration: 0.4 },
          0.75
        )
        .fromTo(
          roleRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.85
        )
        .fromTo(
          linksRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
          1.0
        )
        .to(scrollCueRef.current, { opacity: 1, duration: 0.6 }, 1.3)
    })

    return () => ctx.revert()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header id="hero" className="hero">
      <div className="hero__grid-bg" aria-hidden="true" />
      <GlowOrb size={360} />

      <div className="hero__content">
        <div ref={eyebrowRef} className="hero__eyebrow" aria-hidden="true">
          // Portfolio
        </div>
        <h1 ref={nameRef} className="hero__name">
          Mikee
          <br />
          <span className="hero__name--accent">Quimson</span>
        </h1>
        <div ref={dividerRef} className="hero__divider" aria-hidden="true" />
        <p ref={roleRef} className="hero__role">
          Senior Solutions Architect &amp; Full Stack Developer
        </p>
        <div ref={linksRef} className="hero__links">
          <button
            className="hero__cta hero__cta--primary"
            onClick={() => scrollTo('projects')}
          >
            View Work
          </button>
          <button
            className="hero__cta hero__cta--ghost"
            onClick={() => scrollTo('resume')}
          >
            Resume
          </button>
          <a
            href="mailto:michaelpaulquimson@gmail.com"
            className="hero__cta hero__cta--ghost"
          >
            Contact
          </a>
        </div>
      </div>

      <div ref={scrollCueRef} className="hero__scroll-cue" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span>Scroll</span>
      </div>
    </header>
  )
}

export default Header
```

- [ ] **Step 3: Run dev server and verify hero visually**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run dev
```

Open http://localhost:5173. Expected: full-viewport hero with glow orb, centered "Mikee / Quimson" name, GSAP stagger intro, scroll cue at bottom.

- [ ] **Step 4: Verify build**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run build
```

- [ ] **Step 5: Commit**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio
git add src/components/Header.tsx src/components/Header.css
git commit -m "feat: rebuild hero section with centered cinematic layout and GSAP sequence"
```

---

## Task 6: Resume Rebuild

**Files:**
- Rewrite: `src/components/Resume.tsx`
- Rewrite: `src/components/Resume.css`

- [ ] **Step 1: Rewrite `src/components/Resume.css`**

```css
.resume {
  padding: var(--spacing-3xl) var(--spacing-section-x, 1.5rem);
  max-width: var(--max-width);
  margin: 0 auto;
  width: 100%;
}

.resume__header {
  margin-bottom: var(--spacing-2xl);
}

.resume__section-label {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.resume__section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-subtle);
  max-width: 120px;
}

.resume__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: var(--spacing-md);
}

.resume__summary {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.8;
  max-width: 680px;
}

.resume__body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline__col-title {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-accent);
}

.timeline__item {
  display: flex;
  gap: var(--spacing-md);
  position: relative;
  padding-bottom: var(--spacing-xl);
}

.timeline__item:last-child {
  padding-bottom: 0;
}

.timeline__spine {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.timeline__dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1.5px solid var(--accent-primary);
  background: var(--bg-base);
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.3);
  flex-shrink: 0;
  margin-top: 3px;
  position: relative;
  z-index: 1;
}

.timeline__dot--past {
  border-color: var(--border-accent);
  box-shadow: none;
}

.timeline__line {
  width: 1px;
  flex: 1;
  background: var(--border-subtle);
  margin-top: 4px;
}

.timeline__content {
  flex: 1;
  padding-bottom: var(--spacing-sm);
}

.timeline__company {
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.timeline__role {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--accent-primary);
  opacity: 0.8;
  margin-bottom: 2px;
}

.timeline__period {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  color: var(--text-dim);
  margin-bottom: var(--spacing-sm);
}

.timeline__bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline__bullets li {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  padding-left: 0.75rem;
  position: relative;
}

.timeline__bullets li::before {
  content: '›';
  position: absolute;
  left: 0;
  color: var(--accent-primary);
  opacity: 0.5;
}

/* Skills */
.skills__col-title {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-accent);
}

.skills__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-chip {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  background: var(--bg-surface);
  transition: border-color var(--transition-fast), color var(--transition-fast);
}

.skill-chip--primary {
  border-color: var(--border-accent);
  color: var(--accent-primary);
  background: rgba(0, 255, 255, 0.05);
}

/* Education + Certifications row */
.resume__bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  margin-top: var(--spacing-2xl);
}

.edu-cert__col-title {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-accent);
}

.edu-cert__card {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  transition: border-color var(--transition-normal);
}

.edu-cert__card:hover {
  border-color: var(--border-accent);
}

.edu-cert__name {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.edu-cert__sub {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  color: var(--text-secondary);
}

.edu-cert__date {
  font-family: var(--font-mono);
  font-size: 0.5625rem;
  color: var(--text-dim);
  margin-top: 4px;
}

@media (max-width: 768px) {
  .resume__body,
  .resume__bottom {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Rewrite `src/components/Resume.tsx`**

```tsx
import React, { useRef } from 'react'
import SectionWrapper from './SectionWrapper'
import './Resume.css'

interface ExperienceItem {
  title: string
  company: string
  period: string
  bullets: string[]
  isCurrent: boolean
}

const EXPERIENCE: ExperienceItem[] = [
  {
    title: 'Senior Solutions Architect',
    company: 'Eclaro Business Solutions',
    period: 'FEB 2025 – Present',
    isCurrent: true,
    bullets: [
      'Provide technical guidance on system development and integration',
      'Review code for alignment with architecture standards',
      'Support resolution of complex production issues',
    ],
  },
  {
    title: 'Senior Full Stack Developer',
    company: 'Eclaro Business Solutions',
    period: 'JUN 2021 – FEB 2025 · 3 yrs 11 mos',
    isCurrent: false,
    bullets: [
      'Developed features, fixed bugs, and provided production support',
      'Maintained clear developer documentation for future reference',
      'Improved performance through debugging and refactoring',
    ],
  },
  {
    title: 'Application Developer',
    company: 'AXA Philippines',
    period: 'FEB 2020 – JUN 2021 · 1 yr 4 mos',
    isCurrent: false,
    bullets: [
      'Integrated third-party APIs to enhance application functionality',
      'Assessed design feasibility based on requirements',
      'Collaborated with the team to resolve development challenges',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'Collabera Technologies',
    period: 'JUN 2019 – FEB 2020 · 8 mos',
    isCurrent: false,
    bullets: [
      'Identified and fixed defects to resolve user-reported issues',
      'Participated in code reviews and pair programming',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'LakbayPH Travel Services',
    period: 'JUL 2017 – MAY 2019 · 1 yr 11 mos',
    isCurrent: false,
    bullets: [
      'Designed database schemas and built mobile-friendly web app',
      'Developed and integrated RESTful APIs',
    ],
  },
]

const PRIMARY_SKILLS = ['React', 'TypeScript', 'Node.js', 'Swift', 'Flutter', 'Python']
const OTHER_SKILLS = [
  'React Native', 'PostgreSQL', 'AWS', 'Firebase', 'Docker',
  'GraphQL', 'REST APIs', 'Dart', 'Git', 'Vite',
]

const calculateTotalYears = (): string => {
  const start = new Date(2017, 6)
  const now = new Date()
  const totalMonths =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return `${Math.floor(totalMonths / 12)}+`
}

const Resume: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <SectionWrapper id="resume" className="resume" sectionRef={sectionRef}>
      <div className="resume__header">
        <div className="resume__section-label">// Experience</div>
        <h2 className="resume__title">
          {calculateTotalYears()} Years Building
          <br />
          Software That Matters
        </h2>
        <p className="resume__summary">
          Passionate full-stack engineer spanning frontend, backend, and mobile. Skilled in
          JavaScript, TypeScript, and Python across cloud platforms. Co-built a Flutter app
          serving a non-profit community.
        </p>
      </div>

      <div className="resume__body">
        <div>
          <div className="timeline__col-title">Work History</div>
          <div className="timeline">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="timeline__item">
                <div className="timeline__spine">
                  <div
                    className={`timeline__dot${exp.isCurrent ? '' : ' timeline__dot--past'}`}
                  />
                  {i < EXPERIENCE.length - 1 && <div className="timeline__line" />}
                </div>
                <div className="timeline__content">
                  <div className="timeline__company">{exp.company}</div>
                  <div className="timeline__role">{exp.title}</div>
                  <div className="timeline__period">{exp.period}</div>
                  <ul className="timeline__bullets">
                    {exp.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="skills__col-title">Skills</div>
          <div className="skills__grid">
            {PRIMARY_SKILLS.map((s) => (
              <span key={s} className="skill-chip skill-chip--primary">
                {s}
              </span>
            ))}
            {OTHER_SKILLS.map((s) => (
              <span key={s} className="skill-chip">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="resume__bottom">
        <div>
          <div className="edu-cert__col-title">Education</div>
          <div className="edu-cert__card">
            <div className="edu-cert__name">B.S. Information Technology</div>
            <div className="edu-cert__sub">Informatics College Eastwood</div>
            <div className="edu-cert__date">2013 – 2016 · Philippines</div>
          </div>
        </div>

        <div>
          <div className="edu-cert__col-title">Certifications</div>
          <div className="edu-cert__card">
            <div className="edu-cert__name">AWS Certified Cloud Practitioner</div>
            <div className="edu-cert__date">Feb 2021 – Feb 2024</div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export default Resume
```

- [ ] **Step 3: Verify dev and build**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run build
```

Open http://localhost:5173. Expected: Resume section has vertical timeline on left, skills grid on right. Education and certifications in bottom row.

- [ ] **Step 4: Commit**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio
git add src/components/Resume.tsx src/components/Resume.css
git commit -m "feat: rebuild resume with vertical timeline and skills grid"
```

---

## Task 7: Projects Rebuild

**Files:**
- Rewrite: `src/components/Projects.tsx`
- Rewrite: `src/components/Projects.css`

- [ ] **Step 1: Rewrite `src/components/Projects.css`**

```css
.projects {
  padding: var(--spacing-3xl) var(--spacing-section-x, 1.5rem);
  max-width: var(--max-width);
  margin: 0 auto;
  width: 100%;
}

.projects__header {
  margin-bottom: var(--spacing-xl);
}

.projects__section-label {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--spacing-sm);
}

.projects__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  line-height: 1.1;
}

/* Filter strip */
.projects__filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-xl);
}

.filter-pill {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    color var(--transition-fast),
    background var(--transition-fast);
}

.filter-pill:hover {
  border-color: var(--border-accent);
  color: var(--text-primary);
}

.filter-pill--active {
  border-color: var(--border-accent);
  color: var(--accent-primary);
  background: rgba(0, 255, 255, 0.06);
}

/* Featured card */
.projects__featured {
  margin-bottom: var(--spacing-xl);
}

.featured-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-xl);
  align-items: center;
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-accent);
  background: var(--bg-surface);
  cursor: pointer;
  transition:
    border-color var(--transition-normal),
    box-shadow var(--transition-normal);
}

.featured-card:hover {
  border-color: var(--accent-primary);
  box-shadow: 0 0 32px rgba(0, 255, 255, 0.08);
}

.featured-card__badge {
  font-family: var(--font-mono);
  font-size: 0.5625rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--spacing-sm);
}

.featured-card__title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: var(--spacing-sm);
}

.featured-card__desc {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: var(--spacing-md);
  max-width: 520px;
}

.featured-card__image {
  width: 140px;
  height: 100px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  flex-shrink: 0;
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.featured-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Tech tags */
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.project-tag {
  font-family: var(--font-mono);
  font-size: 0.5625rem;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0, 128, 255, 0.2);
  color: var(--accent-secondary);
  background: rgba(0, 128, 255, 0.06);
}

/* Project links */
.project-links {
  display: flex;
  gap: 0.5rem;
  margin-top: var(--spacing-md);
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.project-link:hover {
  color: var(--accent-primary);
}

/* Grid */
.projects__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.project-card {
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  cursor: pointer;
  transition:
    border-color var(--transition-normal),
    transform var(--transition-normal);
}

.project-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-4px);
}

.project-card:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

.project-card__meta {
  font-family: var(--font-mono);
  font-size: 0.5625rem;
  color: var(--text-dim);
  margin-bottom: var(--spacing-sm);
  display: flex;
  gap: 0.5rem;
}

.project-card__title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  letter-spacing: -0.01em;
}

.project-card__desc {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: var(--spacing-md);
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 16, 0.85);
  backdrop-filter: blur(8px);
  z-index: 200;
}

.project-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 201;
  width: min(680px, calc(100vw - 2rem));
  max-height: 85vh;
  overflow-y: auto;
  background: #0a0a1a;
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
}

.modal-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  transition:
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.modal-close:hover {
  border-color: var(--border-accent);
  color: var(--accent-primary);
}

.modal-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: var(--spacing-md);
  padding-right: 2.5rem;
}

.modal-image-container {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--spacing-md);
  border: 1px solid var(--border-subtle);
}

.modal-image {
  width: 100%;
  height: auto;
  display: block;
}

.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(5, 5, 16, 0.7);
  border: 1px solid var(--border-accent);
  color: var(--accent-primary);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-nav--prev { left: 0.75rem; }
.gallery-nav--next { right: 0.75rem; }

.gallery-indicators {
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.gallery-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  padding: 0;
}

.gallery-indicator--active {
  background: var(--accent-primary);
}

.modal-description {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-lg);
}

.modal-tags-title {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: var(--spacing-sm);
}

.modal-links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: var(--spacing-lg);
}

.modal-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.5rem 1.125rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-accent);
  color: var(--accent-primary);
  text-decoration: none;
  background: rgba(0, 255, 255, 0.06);
  transition:
    background var(--transition-fast),
    box-shadow var(--transition-fast);
}

.modal-link:hover {
  background: rgba(0, 255, 255, 0.12);
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.15);
}

@media (max-width: 768px) {
  .projects__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .featured-card {
    grid-template-columns: 1fr;
  }

  .featured-card__image {
    display: none;
  }
}

@media (max-width: 480px) {
  .projects__grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Rewrite `src/components/Projects.tsx`**

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { FaApple, FaGooglePlay } from 'react-icons/fa'
import SectionWrapper from './SectionWrapper'
import type { Project } from '../types/Project'
import { PROJECTS, CATEGORY_FILTERS } from '../constants/projects'
import './Projects.css'

const Projects: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const filteredProjects =
    selectedCategory === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedCategory)

  const featuredProjects = PROJECTS.filter((p) => p.featured)

  const openModal = (project: Project) => {
    setSelectedProject(project)
    setCurrentImageIndex(0)
  }

  const closeModal = useCallback(() => {
    setSelectedProject(null)
    setCurrentImageIndex(0)
  }, [])

  useEffect(() => {
    if (!selectedProject) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    modalRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedProject, closeModal])

  const nextImage = () => {
    if (!selectedProject?.imageGallery) return
    setCurrentImageIndex((i) => (i + 1) % selectedProject.imageGallery!.length)
  }

  const prevImage = () => {
    if (!selectedProject?.imageGallery) return
    setCurrentImageIndex(
      (i) => (i - 1 + selectedProject.imageGallery!.length) % selectedProject.imageGallery!.length
    )
  }

  return (
    <SectionWrapper id="projects" className="projects" sectionRef={sectionRef}>
      <div className="projects__header">
        <div className="projects__section-label">// Work</div>
        <h2 className="projects__title">Featured Projects</h2>
      </div>

      <div className="projects__filters" role="group" aria-label="Filter by category">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat.id}
            className={`filter-pill${selectedCategory === cat.id ? ' filter-pill--active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
            aria-pressed={selectedCategory === cat.id}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {selectedCategory === 'all' && featuredProjects.length > 0 && (
        <div className="projects__featured">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="featured-card"
              onClick={() => openModal(project)}
              role="button"
              tabIndex={0}
              aria-label={`Open ${project.title} details`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openModal(project)
                }
              }}
            >
              <div>
                <div className="featured-card__badge">★ Featured</div>
                <div className="featured-card__title">{project.title}</div>
                <div className="featured-card__desc">{project.description}</div>
                <div className="project-tags">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Visit ${project.title} website (opens in new window)`}
                    >
                      <ExternalLink size={13} />
                      Website
                    </a>
                  )}
                  {project.githubUrl && !project.githubUrl.includes('play.google.com') && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`View ${project.title} source code on GitHub (opens in new window)`}
                    >
                      <Github size={13} />
                      Code
                    </a>
                  )}
                  {project.githubUrl?.includes('play.google.com') && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Download on Google Play Store (opens in new window)"
                    >
                      <FaGooglePlay size={13} />
                      Play Store
                    </a>
                  )}
                  {project.extraLinks?.appStore && (
                    <a
                      href={project.extraLinks.appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Download on Apple App Store (opens in new window)"
                    >
                      <FaApple size={13} />
                      App Store
                    </a>
                  )}
                </div>
              </div>
              {project.imageUrl && (
                <div className="featured-card__image">
                  <img src={project.imageUrl} alt="" aria-hidden="true" loading="lazy" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <motion.div className="projects__grid" layout>
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.article
              key={project.id}
              className="project-card"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => openModal(project)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openModal(project)
                }
              }}
              aria-label={`Open ${project.title} details`}
            >
              <div className="project-card__meta">
                <span>{project.year}</span>
                <span>·</span>
                <span>{project.category}</span>
              </div>
              <div className="project-card__title">{project.title}</div>
              <p className="project-card__desc">{project.description}</p>
              <div className="project-tags">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="project-tag">
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="project-tag">+{project.tags.length - 3}</span>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              aria-hidden="true"
            />
            <motion.div
              ref={modalRef}
              className="project-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className="modal-close"
                onClick={closeModal}
                aria-label="Close project details"
              >
                ×
              </button>

              <h3 id="modal-title" className="modal-title">
                {selectedProject.title}
              </h3>

              {selectedProject.imageGallery && selectedProject.imageGallery.length > 0 && (
                <div className="modal-image-container">
                  <img
                    src={selectedProject.imageGallery[currentImageIndex]}
                    alt={`${selectedProject.title} screenshot ${currentImageIndex + 1} of ${selectedProject.imageGallery.length}`}
                    className="modal-image"
                  />
                  {selectedProject.imageGallery.length > 1 && (
                    <>
                      <button
                        className="gallery-nav gallery-nav--prev"
                        onClick={prevImage}
                        aria-label="Previous image"
                      >
                        ‹
                      </button>
                      <button
                        className="gallery-nav gallery-nav--next"
                        onClick={nextImage}
                        aria-label="Next image"
                      >
                        ›
                      </button>
                      <div className="gallery-indicators" role="tablist">
                        {selectedProject.imageGallery.map((_, i) => (
                          <button
                            key={i}
                            className={`gallery-indicator${i === currentImageIndex ? ' gallery-indicator--active' : ''}`}
                            onClick={() => setCurrentImageIndex(i)}
                            role="tab"
                            aria-selected={i === currentImageIndex}
                            aria-label={`Image ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <p className="modal-description">{selectedProject.longDescription}</p>

              <div className="modal-tags-title">Technologies</div>
              <div className="project-tags">
                {selectedProject.tags.map((tag) => (
                  <span key={tag} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="modal-links">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-link"
                    aria-label={`Visit ${selectedProject.title} website (opens in new window)`}
                  >
                    <ExternalLink size={15} />
                    Visit Website
                  </a>
                )}
                {selectedProject.githubUrl && !selectedProject.githubUrl.includes('play.google.com') && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-link"
                    aria-label={`View ${selectedProject.title} source code on GitHub (opens in new window)`}
                  >
                    <Github size={15} />
                    View Code
                  </a>
                )}
                {selectedProject.githubUrl?.includes('play.google.com') && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-link"
                    aria-label="Download on Google Play Store (opens in new window)"
                  >
                    <FaGooglePlay size={15} />
                    Google Play
                  </a>
                )}
                {selectedProject.extraLinks?.appStore && (
                  <a
                    href={selectedProject.extraLinks.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-link"
                    aria-label="Download on Apple App Store (opens in new window)"
                  >
                    <FaApple size={15} />
                    App Store
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}

export default Projects
```

- [ ] **Step 3: Verify dev and build**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run build
```

Open http://localhost:5173. Expected: Projects section shows filter pills, featured card, project grid. Clicking a card opens modal. Escape closes modal. Gallery arrows work.

- [ ] **Step 4: Commit**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio
git add src/components/Projects.tsx src/components/Projects.css
git commit -m "feat: rebuild projects with masonry grid, filter pills, and accessible modal"
```

---

## Task 8: ToolsSection (Compact Accordion)

**Files:**
- Create: `src/components/ToolsSection.tsx`
- Create: `src/components/ToolsSection.css`

- [ ] **Step 1: Create `src/components/ToolsSection.css`**

```css
.tools-section {
  padding: var(--spacing-3xl) var(--spacing-section-x, 1.5rem);
  max-width: var(--max-width);
  margin: 0 auto;
  width: 100%;
}

.tools-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
}

.tools-section__label {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.tools-section__toggle {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  color: var(--accent-primary);
  background: transparent;
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-sm);
  padding: 0.3rem 0.75rem;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    box-shadow var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 4px;
}

.tools-section__toggle:hover {
  background: rgba(0, 255, 255, 0.06);
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.1);
}

.tools-section__preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.tool-preview-card {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
}

.tool-preview-card__icon {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.tool-preview-card__name {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.tool-preview-card__sub {
  font-family: var(--font-mono);
  font-size: 0.5625rem;
  color: var(--text-dim);
}

.tools-section__expanded {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-accent);
  background: var(--bg-surface);
  overflow: hidden;
}

.tool-tab-bar {
  display: flex;
  border-bottom: 1px solid var(--border-subtle);
}

.tool-tab {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast);
}

.tool-tab--active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}

.tool-tab:hover:not(.tool-tab--active) {
  color: var(--text-primary);
}

.tool-content {
  padding: var(--spacing-xl);
}

@media (max-width: 768px) {
  .tools-section__preview {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Create `src/components/ToolsSection.tsx`**

```tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionWrapper from './SectionWrapper'
import QRGenerator from './QRGenerator'
import APITester from './APITester'
import FileProcessor from './FileProcessor'
import './ToolsSection.css'

type ToolId = 'qr' | 'api' | 'file'

const TOOLS: { id: ToolId; icon: string; name: string; sub: string }[] = [
  { id: 'qr', icon: '⬡', name: 'QR Generator', sub: 'Text → QR code' },
  { id: 'api', icon: '⟳', name: 'API Tester', sub: 'HTTP requests' },
  { id: 'file', icon: '⬢', name: 'File Processor', sub: 'Compress · Convert' },
]

const ToolsSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTool, setActiveTool] = useState<ToolId>('qr')

  return (
    <SectionWrapper id="tools" className="tools-section">
      <div className="tools-section__header">
        <div className="tools-section__label">// Utility Tools</div>
        <button
          className="tools-section__toggle"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          aria-controls="tools-expanded"
        >
          {isExpanded ? '▴ Collapse' : '▾ Expand'}
        </button>
      </div>

      <div className="tools-section__preview" aria-hidden={isExpanded}>
        {TOOLS.map((t) => (
          <div key={t.id} className="tool-preview-card">
            <div className="tool-preview-card__icon">{t.icon}</div>
            <div className="tool-preview-card__name">{t.name}</div>
            <div className="tool-preview-card__sub">{t.sub}</div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="tools-expanded"
            className="tools-section__expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="tool-tab-bar" role="tablist">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  className={`tool-tab${activeTool === t.id ? ' tool-tab--active' : ''}`}
                  onClick={() => setActiveTool(t.id)}
                  role="tab"
                  aria-selected={activeTool === t.id}
                  aria-controls={`tool-panel-${t.id}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
            <div className="tool-content">
              <div
                id="tool-panel-qr"
                role="tabpanel"
                hidden={activeTool !== 'qr'}
              >
                {activeTool === 'qr' && <QRGenerator />}
              </div>
              <div
                id="tool-panel-api"
                role="tabpanel"
                hidden={activeTool !== 'api'}
              >
                {activeTool === 'api' && <APITester />}
              </div>
              <div
                id="tool-panel-file"
                role="tabpanel"
                hidden={activeTool !== 'file'}
              >
                {activeTool === 'file' && <FileProcessor />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}

export default ToolsSection
```

- [ ] **Step 3: Verify build**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio
git add src/components/ToolsSection.tsx src/components/ToolsSection.css
git commit -m "feat: add compact ToolsSection accordion with tabbed tool switcher"
```

---

## Task 9: Portfolio Orchestration

**Files:**
- Rewrite: `src/components/Portfolio.tsx`
- Rewrite: `src/components/Portfolio.css`

- [ ] **Step 1: Rewrite `src/components/Portfolio.css`**

```css
.portfolio {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-base);
  color: var(--text-primary);
}

.portfolio__main {
  width: 100%;
}

/* Section max-width centering */
.resume,
.projects,
.tools-section {
  max-width: var(--max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: max(var(--spacing-xl), (100vw - var(--max-width)) / 2);
  padding-right: max(var(--spacing-xl), (100vw - var(--max-width)) / 2);
}

@media (max-width: 1140px) {
  .resume,
  .projects,
  .tools-section {
    padding-left: var(--spacing-xl);
    padding-right: var(--spacing-xl);
  }
}

@media (max-width: 768px) {
  .resume,
  .projects,
  .tools-section {
    padding-left: var(--spacing-lg);
    padding-right: var(--spacing-lg);
  }
}
```

- [ ] **Step 2: Rewrite `src/components/Portfolio.tsx`**

```tsx
import React, { useRef } from 'react'
import Header from './Header'
import Resume from './Resume'
import Projects from './Projects'
import ToolsSection from './ToolsSection'
import DotNavigation from './DotNavigation'
import DarkModeToggle from './DarkModeToggle'
import ScrollToTop from './ScrollToTop'
import { useScrollSection } from '../hooks/useScrollSection'
import type { SectionRefs } from '../hooks/useScrollSection'
import './Portfolio.css'

const Portfolio: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null)
  const resumeRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)
  const toolsRef = useRef<HTMLElement>(null)

  const sectionRefs: SectionRefs = {
    hero: heroRef,
    resume: resumeRef,
    projects: projectsRef,
    tools: toolsRef,
  }

  const activeSection = useScrollSection(sectionRefs)

  return (
    <div className="portfolio">
      <DotNavigation activeSection={activeSection} />
      <DarkModeToggle />

      <Header />

      <main className="portfolio__main">
        <Resume />
        <Projects />
        <ToolsSection />
      </main>

      <ScrollToTop />
    </div>
  )
}

export default Portfolio
```

Note: The `sectionRefs` are passed to `useScrollSection` for the dot nav. The `Header`, `Resume`, `Projects`, and `ToolsSection` components each receive their own `sectionRef` internally via `SectionWrapper`. If `useScrollSection` needs the same refs used by `SectionWrapper`, update `SectionWrapper` to accept and forward the ref. The simplest approach: pass `sectionRef` prop to `SectionWrapper` in each section (already implemented in Task 3 step 3 and used in Task 6 step 2). Wire the refs from Portfolio:

Update `Portfolio.tsx` to pass refs explicitly to each section. This requires updating `Resume`, `Projects`, and `ToolsSection` to accept a `sectionRef` prop, then pass it to `SectionWrapper`:

**Update `Resume.tsx`** — add `sectionRef` prop and remove the internal ref:
```tsx
// Remove this line:
// const sectionRef = useRef<HTMLElement>(null)

interface ResumeProps {
  sectionRef?: React.RefObject<HTMLElement | null>
}

const Resume: React.FC<ResumeProps> = ({ sectionRef }) => {
  return (
    <SectionWrapper id="resume" className="resume" sectionRef={sectionRef}>
      {/* ... existing content ... */}
    </SectionWrapper>
  )
}
```

**Update `Projects.tsx`** — add `sectionRef` prop:
```tsx
interface ProjectsProps {
  sectionRef?: React.RefObject<HTMLElement | null>
}

const Projects: React.FC<ProjectsProps> = ({ sectionRef }) => {
  return (
    <SectionWrapper id="projects" className="projects" sectionRef={sectionRef}>
      {/* ... existing content ... */}
    </SectionWrapper>
  )
}
```

**Update `ToolsSection.tsx`** — add `sectionRef` prop:
```tsx
interface ToolsSectionProps {
  sectionRef?: React.RefObject<HTMLElement | null>
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ sectionRef }) => {
  return (
    <SectionWrapper id="tools" className="tools-section" sectionRef={sectionRef}>
      {/* ... existing content ... */}
    </SectionWrapper>
  )
}
```

**Update `Portfolio.tsx`** — pass refs:
```tsx
<Header />

<main className="portfolio__main">
  <Resume sectionRef={resumeRef} />
  <Projects sectionRef={projectsRef} />
  <ToolsSection sectionRef={toolsRef} />
</main>
```

The `heroRef` is attached by targeting the `<header id="hero">` element directly. Update `Header.tsx` to accept and forward a `sectionRef` prop:
```tsx
interface HeaderProps {
  sectionRef?: React.RefObject<HTMLElement | null>
}

const Header: React.FC<HeaderProps> = ({ sectionRef }) => {
  // ...
  return (
    <header
      id="hero"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="hero"
    >
      {/* ... */}
    </header>
  )
}
```

Then in `Portfolio.tsx`:
```tsx
<Header sectionRef={heroRef} />
```

- [ ] **Step 3: Verify dev server**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run dev
```

Open http://localhost:5173. Expected:
- Dot nav appears on right edge
- Dots highlight as you scroll through sections
- All 4 sections visible and styled
- DarkModeToggle visible

- [ ] **Step 4: Verify build**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run build
```

Expected: clean build, zero TypeScript errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio
git add src/components/Portfolio.tsx src/components/Portfolio.css src/components/Header.tsx src/components/Resume.tsx src/components/Projects.tsx src/components/ToolsSection.tsx
git commit -m "feat: wire Portfolio orchestration with scroll-tracking dot navigation"
```

---

## Task 10: DarkModeToggle and ScrollToTop Refresh

**Files:**
- Rewrite: `src/components/DarkModeToggle.tsx`
- Rewrite: `src/components/DarkModeToggle.css`
- Rewrite: `src/components/ScrollToTop.tsx`
- Rewrite: `src/components/ScrollToTop.css`

- [ ] **Step 1: Read current DarkModeToggle.tsx and ScrollToTop.tsx before editing**

```bash
cat /Users/michaelpaulquimson/Documents/sandbox/portfolio/src/components/DarkModeToggle.tsx
cat /Users/michaelpaulquimson/Documents/sandbox/portfolio/src/components/ScrollToTop.tsx
```

- [ ] **Step 2: Rewrite `src/components/DarkModeToggle.css`**

```css
.dark-mode-toggle {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 100;
  background: var(--bg-surface);
  border: 1px solid var(--border-accent);
  border-radius: 20px;
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  color: var(--accent-primary);
  backdrop-filter: blur(8px);
  transition:
    background var(--transition-fast),
    box-shadow var(--transition-fast),
    border-color var(--transition-fast);
}

.dark-mode-toggle:hover {
  background: rgba(0, 255, 255, 0.08);
  box-shadow: 0 0 12px var(--accent-glow);
}

.dark-mode-toggle__icon {
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .dark-mode-toggle {
    top: 0.75rem;
    right: 0.75rem;
  }
}
```

- [ ] **Step 3: Rewrite `src/components/DarkModeToggle.tsx`**

```tsx
import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import './DarkModeToggle.css'

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDarkMode}
    >
      <span className="dark-mode-toggle__icon" aria-hidden="true">
        {isDarkMode ? '☀' : '◑'}
      </span>
      {isDarkMode ? 'Light' : 'Dark'}
    </button>
  )
}

export default DarkModeToggle
```

- [ ] **Step 4: Rewrite `src/components/ScrollToTop.css`**

```css
.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 1.5rem;
  z-index: 100;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-accent);
  background: var(--bg-surface);
  color: var(--accent-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  transition:
    opacity var(--transition-normal),
    transform var(--transition-normal),
    box-shadow var(--transition-fast);
}

.scroll-to-top:hover {
  box-shadow: 0 0 12px var(--accent-glow);
  transform: translateY(-2px);
}
```

- [ ] **Step 5: Rewrite `src/components/ScrollToTop.tsx`**

```tsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './ScrollToTop.css'

const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTop
```

- [ ] **Step 6: Verify build**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run build
```

- [ ] **Step 7: Commit**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio
git add src/components/DarkModeToggle.tsx src/components/DarkModeToggle.css src/components/ScrollToTop.tsx src/components/ScrollToTop.css
git commit -m "feat: refresh DarkModeToggle and ScrollToTop to match new design system"
```

---

## Task 11: Accessibility and Performance Pass

**Files:**
- Modify: `src/components/Projects.tsx` (focus trap already added in Task 7)
- Modify: `src/components/Portfolio.tsx` (lazy loading)

- [ ] **Step 1: Add `prefers-reduced-motion` check to Hero GSAP sequence in `Header.tsx`**

In `src/components/Header.tsx`, update the `useEffect` to skip the timeline when the user prefers reduced motion:

```tsx
useEffect(() => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  const ctx = gsap.context(() => {
    if (prefersReducedMotion) {
      gsap.set(
        [
          eyebrowRef.current,
          nameRef.current,
          dividerRef.current,
          roleRef.current,
          linksRef.current,
          scrollCueRef.current,
        ],
        { opacity: 1, y: 0, scaleX: 1 }
      )
      return
    }

    gsap.set(
      [
        eyebrowRef.current,
        nameRef.current,
        dividerRef.current,
        roleRef.current,
        linksRef.current,
        scrollCueRef.current,
      ],
      { opacity: 0 }
    )

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
      .fromTo(nameRef.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9 }, 0.35)
      .fromTo(dividerRef.current, { opacity: 1, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.4 }, 0.75)
      .fromTo(roleRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 0.85)
      .fromTo(linksRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.0)
      .to(scrollCueRef.current, { opacity: 1, duration: 0.6 }, 1.3)
  })

  return () => ctx.revert()
}, [])
```

- [ ] **Step 2: Add React.lazy for Projects and ToolsSection in `Portfolio.tsx`**

Replace the static imports at the top of `src/components/Portfolio.tsx`:

Remove:
```tsx
import Projects from './Projects'
import ToolsSection from './ToolsSection'
```

Add after the remaining imports:
```tsx
import React, { useRef, Suspense, lazy } from 'react'

const Projects = lazy(() => import('./Projects'))
const ToolsSection = lazy(() => import('./ToolsSection'))
```

Wrap `<main>` content in `Portfolio.tsx` with Suspense:
```tsx
<main className="portfolio__main">
  <Resume sectionRef={resumeRef} />
  <Suspense fallback={<div style={{ height: '100vh' }} />}>
    <Projects sectionRef={projectsRef} />
    <ToolsSection sectionRef={toolsRef} />
  </Suspense>
</main>
```

- [ ] **Step 2: Add React.memo to ProjectCard internals**

In `src/components/Projects.tsx`, wrap the `motion.article` card in a memoised sub-component at the bottom of the file, above `export default`:

```tsx
interface ProjectCardProps {
  project: Project
  onClick: (p: Project) => void
}

const ProjectCard = React.memo<ProjectCardProps>(({ project, onClick }) => (
  <motion.article
    key={project.id}
    className="project-card"
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
    onClick={() => onClick(project)}
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick(project)
      }
    }}
    aria-label={`Open ${project.title} details`}
  >
    <div className="project-card__meta">
      <span>{project.year}</span>
      <span>·</span>
      <span>{project.category}</span>
    </div>
    <div className="project-card__title">{project.title}</div>
    <p className="project-card__desc">{project.description}</p>
    <div className="project-tags">
      {project.tags.slice(0, 3).map((tag) => (
        <span key={tag} className="project-tag">
          {tag}
        </span>
      ))}
      {project.tags.length > 3 && (
        <span className="project-tag">+{project.tags.length - 3}</span>
      )}
    </div>
  </motion.article>
))
ProjectCard.displayName = 'ProjectCard'
```

Then replace the `motion.article` in the grid loop with `<ProjectCard key={project.id} project={project} onClick={openModal} />`.

- [ ] **Step 3: Verify full build with no TypeScript errors**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run build
```

Expected: clean build.

- [ ] **Step 4: Run lint**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run lint
```

Expected: no errors. Fix any reported issues before committing.

- [ ] **Step 5: Commit**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio
git add src/components/Portfolio.tsx src/components/Projects.tsx
git commit -m "perf: add React.lazy for Projects/Tools and React.memo for ProjectCard"
```

---

## Task 12: README and Documentation Update

**Files:**
- Rewrite: `README.md`
- Update: `CLAUDE.md` (CSS variables section only)

- [ ] **Step 1: Rewrite `README.md`**

```markdown
# Mikee Quimson — Portfolio

Personal portfolio and interactive tool showcase. Built with React 19, TypeScript, and Vite.

**Live site:** https://mikee-quimson.github.io/portfolio/ *(update with actual URL)*

---

## Features

- **Hero** — Full-viewport cinematic section with GSAP intro animation
- **Resume** — Vertical timeline of experience, skills grid, education and certifications
- **Projects** — Filterable card grid with image gallery modal
- **Tools** — Collapsible accordion: QR Generator, API Tester, File Processor
- **Dark/Light mode** — System-aware, persisted to localStorage
- **Dot navigation** — Right-edge scroll indicator with active section tracking

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript 5.8 |
| Build | Vite 7 |
| Animation | Framer Motion 12 + GSAP 3 |
| Icons | Lucide React + react-icons |
| Utilities | qrcode, pdf-lib, browser-image-compression |
| Deploy | GitHub Pages via gh-pages |

---

## Local Setup

```bash
git clone <repo-url>
cd portfolio
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
npm run preview   # preview production build
npm run deploy    # deploy to GitHub Pages
```

---

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Hero section (GSAP intro)
│   ├── Resume.tsx          # Timeline + skills
│   ├── Projects.tsx        # Grid + modal
│   ├── ToolsSection.tsx    # Compact accordion wrapper
│   ├── QRGenerator.tsx     # QR code tool
│   ├── APITester.tsx       # HTTP request tool
│   ├── FileProcessor.tsx   # File conversion tool
│   ├── DotNavigation.tsx   # Right dot nav
│   ├── GlowOrb.tsx         # Reusable glow orb
│   ├── SectionWrapper.tsx  # Scroll-reveal wrapper
│   ├── DarkModeToggle.tsx  # Theme toggle
│   └── ScrollToTop.tsx     # Back-to-top button
├── constants/
│   ├── designTokens.ts     # Typed token constants
│   └── projects.ts         # Portfolio project data
├── contexts/
│   └── ThemeContext.tsx     # Dark/Light theme provider
├── hooks/
│   ├── useScrollSection.ts # IntersectionObserver section tracker
│   └── useGSAP.ts          # GSAP animation hook
└── types/
    └── Project.ts          # Project type definitions
```

---

## Customisation

### Add a project

Edit `src/constants/projects.ts`. Add an object to the `PROJECTS` array:

```typescript
{
  id: 3,
  title: "My New Project",
  description: "One sentence description.",
  longDescription: "Full description shown in the modal.",
  tags: ["React", "Node.js"],
  category: "fullstack",   // "web" | "mobile" | "fullstack" | "tool"
  imageUrl: "/portfolio/images/my-project/cover.webp",
  imageGallery: ["/portfolio/images/my-project/1.webp"],
  liveUrl: "https://example.com",
  githubUrl: "https://github.com/user/repo",
  year: "2026",
  featured: false,
}
```

### Change accent color

Update the CSS custom properties in `src/index.css`:

```css
:root {
  --accent-primary: #00ffff;    /* primary accent */
  --accent-secondary: #0080ff;  /* secondary accent */
  --accent-glow: rgba(0,255,255,0.25);
}
```

Mirror the values in `src/constants/designTokens.ts` for TypeScript consumers.

---

## Deployment

The site deploys to GitHub Pages via the `gh-pages` package:

```bash
npm run deploy
```

Ensure `vite.config.ts` has `base: '/portfolio/'` set correctly for your repo name.
```

- [ ] **Step 2: Update CSS variables section in `CLAUDE.md`**

Find the section in `CLAUDE.md` that documents CSS variables (under "CSS Best Practices" → "Use CSS Custom Properties"). Replace the example variables block with:

```css
:root {
  /* Design tokens — single source of truth */
  --bg-base: #050510;
  --bg-surface: rgba(255,255,255,0.02);
  --accent-primary: #00ffff;
  --accent-secondary: #0080ff;
  --accent-glow: rgba(0,255,255,0.25);
  --text-primary: #ffffff;
  --text-secondary: rgba(255,255,255,0.45);
  --border-accent: rgba(0,255,255,0.15);

  --font-display: 'Space Grotesk', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --transition-fast: 150ms ease-out;
  --transition-normal: 300ms cubic-bezier(0.4,0,0.2,1);

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

- [ ] **Step 3: Final lint and build check**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio && npm run lint && npm run build
```

Expected: lint passes, build succeeds.

- [ ] **Step 4: Commit**

```bash
cd /Users/michaelpaulquimson/Documents/sandbox/portfolio
git add README.md CLAUDE.md
git commit -m "docs: rewrite README with setup guide and update CLAUDE.md design tokens"
```
