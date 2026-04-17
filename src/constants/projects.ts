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
    id: 3,
    title: "Myles Yeo Tan — Portfolio",
    description: "Production portfolio for a crypto trader, certified financial planner, and public speaker with SSR and transactional email.",
    longDescription: "Production portfolio website for a crypto trader, certified financial planner, and public speaker. Built with Next.js 16 and TypeScript, featuring server-side rendering on all pages with JSON-LD structured data (Person, WebSite, ProfessionalService schemas). REST API routes handle contact and newsletter with server-side validation. Full security header suite — CSP, HSTS, X-Frame-Options, Permissions-Policy. 30 Jest tests covering API validation, UI components, and error handling. SEO-optimized with sitemap, robots.txt, Open Graph, Twitter Cards, and AI-crawler-friendly llms.txt.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Radix UI", "Resend", "Google Analytics", "Vercel"],
    category: "web",
    year: "2025",
    featured: false,
    imageUrl: "/portfolio/images/mylestan/preview.jpg",
    imageGallery: ["/portfolio/images/mylestan/preview.jpg"],
    liveUrl: "https://mylesyeotan.com",
    githubUrl: "https://github.com/startupenablr-dev/mylestan-website-v2"
  },
  {
    id: 2,
    title: "Favor App",
    description: "Church event management with QR code check-in and registration",
    longDescription: "A cross-platform mobile application for Favor Church built with Flutter and Dart for iOS and Android. Features include event check-in, event registration, and QR scanner for admins. The app streamlines church event management with a Node.js backend for real-time updates and cloud storage.",
    tags: ["Flutter", "Dart", "Node.js", "QR Code", "Mobile"],
    category: "mobile",
    year: "2024",
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
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'web', label: 'Web' },
  { id: 'tool', label: 'Tools' }
]
