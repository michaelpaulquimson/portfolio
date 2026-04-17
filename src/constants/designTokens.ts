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
