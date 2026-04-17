# Mikee Quimson — Portfolio

Personal portfolio and interactive tool showcase. Built with React 19, TypeScript, and Vite.

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
