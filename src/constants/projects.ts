import type { Project, CategoryFilter } from '../types/Project'
import { Layers } from 'lucide-react'

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
    githubUrl: "https://play.google.com/store/apps/details?id=church.favor.app",
    extraLinks: {
      appStore: "https://apps.apple.com/ph/app/favor-app-favor-church-events/id6477150469"
    }
  }
]

/**
 * Category filter configuration
 */
export const CATEGORY_FILTERS: CategoryFilter[] = [
  { id: 'all', label: 'All Projects', icon: Layers },
  { id: 'fullstack', label: 'Full Stack', icon: Layers },
  { id: 'mobile', label: 'Mobile', icon: Layers },
  { id: 'web', label: 'Web', icon: Layers },
  { id: 'tool', label: 'Tools', icon: Layers }
]
