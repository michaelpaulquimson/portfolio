import type { Project, CategoryFilter } from '../types/Project'

/**
 * Project portfolio data
 *
 * To add your own projects:
 * 1. Add a new Project object to the PROJECTS array
 * 2. Update the id, title, description, and other fields
 * 3. Set featured: true for projects you want to highlight
 * 4. Add relevant tags and category
 * 5. Include liveUrl and/or githubUrl if available
 */
export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Moonwatcher",
    description: "Discord trading signal bot for Crypto, PSE, and US stocks — actively used by a crypto community.",
    longDescription: [
      "Delivers real-time trading signals for Crypto, PSE, and US stock markets via Discord.",
      "AI bots using ML and LLM models analyze market conditions and generate trade decisions.",
      "Trade execution integrated via the OKX API.",
      "Actively maintained and used by a known crypto community as a reliable signal feed.",
    ],
    tags: ["Python", "Discord API", "ML/LLM", "OKX API", "Trading"],
    category: "tool",
    year: "2025",
    featured: false,
    imageUrl: "/portfolio/images/moonwatcher/moonwatcher-1.png",
    imageGallery: [
      "/portfolio/images/moonwatcher/moonwatcher-1.png",
      "/portfolio/images/moonwatcher/moonwatcher-2.png",
      "/portfolio/images/moonwatcher/moonwatcher-3.png",
    ],
  },
  {
    id: 3,
    title: "Myles Yeo Tan — Portfolio",
    description: "Production portfolio for a crypto trader, certified financial planner, and public speaker.",
    longDescription: [
      "Next.js 16 + TypeScript with server-side rendering throughout.",
      "REST API routes for contact and newsletter with server-side validation.",
      "30 Jest tests across API routes, UI components, and error handling.",
      "Cloudflare for CDN, bot protection, and WAF rate-limiting on API endpoints.",
      "AI-discoverable via llms.txt — optimized for ChatGPT, Perplexity, and other LLM crawlers.",
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Radix UI", "Resend", "Cloudflare", "Vercel"],
    category: "web",
    year: "2026",
    featured: false,
    imageUrl: "/portfolio/images/mylestan/preview.png",
    imageGallery: ["/portfolio/images/mylestan/preview.png"],
    liveUrl: "https://mylesyeotan.com",
    githubUrl: "https://github.com/startupenablr-dev/mylestan-website-v2"
  },
  {
    id: 4,
    title: "Bear Bull Hunter",
    description: "AI-powered crypto trading platform with multi-bot management and autonomous OKX trade execution.",
    longDescription: [
      "Multi-bot system trading concurrent crypto pairs on OKX perpetual swaps.",
      "LLM signal generation (Grok/OpenAI/DeepSeek) with Kelly Criterion dynamic leverage sizing.",
      "LightGBM ML classifier predicts trade win probability to guide directional bias.",
      "Circuit breaker guardrails: MDD limits, consecutive loss detection, automatic bot disabling.",
      "FastAPI + async MongoDB backend, Next.js dashboard, Docker/AWS ECS deployment.",
    ],
    tags: ["Python", "FastAPI", "Next.js", "ML/LLM", "LightGBM", "OKX API", "MongoDB"],
    category: "tool",
    year: "2025",
    featured: false,
    imageUrl: "/portfolio/images/bearbullhunter/preview.png",
    imageGallery: [
      "/portfolio/images/bearbullhunter/preview.png",
      "/portfolio/images/bearbullhunter/preview-2.png",
      "/portfolio/images/bearbullhunter/preview-3.png",
    ],
  },
  {
    id: 2,
    title: "Favor App",
    description: "Church event management with QR code check-in and registration",
    longDescription: [
      "Flutter + Dart — single codebase running natively on iOS and Android.",
      "Custom Node.js + Express + TypeScript REST API with MongoDB and Mongoose.",
      "QR code generation and scanning for event check-in and admin workflows.",
      "Zod validation, Express rate limiting, and Swagger API documentation.",
      "Published on both the Apple App Store and Google Play Store.",
    ],
    tags: ["Flutter", "Dart", "Node.js", "TypeScript", "MongoDB", "Express"],
    category: "mobile",
    year: "2023",
    featured: true,
    imageUrl: "/portfolio/images/favor-app/favor-app-1.webp",
    imageGallery: [
      "/portfolio/images/favor-app/favor-app-1.webp",
      "/portfolio/images/favor-app/favor-app-2.webp",
      "/portfolio/images/favor-app/favor-app-3.webp",
      "/portfolio/images/favor-app/favor-app-4.webp",
      "/portfolio/images/favor-app/favor-app-5.webp",
      "/portfolio/images/favor-app/favor-app-6.webp"
    ],
    liveUrl: "https://favor.church/mnl",
    extraLinks: {
      appStore: "https://apps.apple.com/ph/app/favor-app-favor-church-events/id6477150469",
      playStore: "https://play.google.com/store/apps/details?id=church.favor.app"
    }
  }
]

/**
 * Category filter configuration
 */
export const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all', label: 'All' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'web', label: 'Web' },
  { id: 'tool', label: 'Tools' },
]
