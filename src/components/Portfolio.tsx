import React, { useRef, lazy, Suspense, useMemo } from 'react'
import Header from './Header'
import Resume from './Resume'
import DotNavigation from './DotNavigation'
import DarkModeToggle from './DarkModeToggle'
import ScrollToTop from './ScrollToTop'
import { useScrollSection } from '../hooks/useScrollSection'
import type { SectionRefs } from '../hooks/useScrollSection'
import './Portfolio.css'

const Projects = lazy(() => import('./Projects'))
const ToolsSection = lazy(() => import('./ToolsSection'))

const Portfolio: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null)
  const resumeRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)
  const toolsRef = useRef<HTMLElement>(null)

  const sectionRefs: SectionRefs = useMemo(() => ({
    hero: heroRef,
    resume: resumeRef,
    projects: projectsRef,
    tools: toolsRef,
  }), [])

  const activeSection = useScrollSection(sectionRefs)

  return (
    <div className="portfolio">
      <DotNavigation activeSection={activeSection} />
      <DarkModeToggle />

      <Header sectionRef={heroRef} />

      <main className="portfolio__main">
        <Resume sectionRef={resumeRef} />
        <Suspense fallback={<div style={{ height: '100vh' }} />}>
          <Projects sectionRef={projectsRef} />
        </Suspense>
        <Suspense fallback={<div style={{ height: '60vh' }} />}>
          <ToolsSection sectionRef={toolsRef} />
        </Suspense>
      </main>

      <ScrollToTop />
    </div>
  )
}

export default Portfolio
