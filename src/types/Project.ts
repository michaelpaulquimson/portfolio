/**
 * Project type definitions
 */

import type { ComponentType } from 'react'

export type ProjectCategory = 'web' | 'mobile' | 'fullstack' | 'tool'

export interface Project {
  id: number
  title: string
  description: string
  longDescription: string
  tags: string[]
  category: ProjectCategory
  imageUrl?: string
  imageGallery?: string[]
  liveUrl?: string
  githubUrl?: string
  year: string
  featured: boolean
  extraLinks?: {
    appStore?: string
    playStore?: string
    [key: string]: string | undefined
  }
}

export interface CategoryFilter {
  id: string
  label: string
  icon: ComponentType<{ size?: number }>
}
