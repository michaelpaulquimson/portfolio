import React, { useRef, lazy, Suspense, useMemo, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Header from './Header'
import Resume from './Resume'
import DotNavigation from './DotNavigation'
import DarkModeToggle from './DarkModeToggle'
import ScrollToTop from './ScrollToTop'
import CommandPalette from './CommandPalette'
import BuildHud from './BuildHud'
import { useScrollSection } from '../hooks/useScrollSection'
import { useCardEffects } from '../hooks/useCardEffects'
import { useCursorGlow } from '../hooks/useCursorGlow'
import { useBuildDirector } from '../hooks/useBuildDirector'
import type { SectionRefs } from '../hooks/useScrollSection'
import './Portfolio.css'

const Projects = lazy(() => import('./Projects'))
const ToolsSection = lazy(() => import('./ToolsSection'))

const prefersMotion = (): boolean =>
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const Portfolio: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null)
  const resumeRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)
  const toolsRef = useRef<HTMLElement>(null)

  // The page builds itself live on every load; reduced-motion visitors get the finished page.
  const [buildEnabled] = useState(prefersMotion)
  const { snapshot, skip } = useBuildDirector(buildEnabled)

  const sectionRefs: SectionRefs = useMemo(() => ({
    hero: heroRef,
    resume: resumeRef,
    projects: projectsRef,
    tools: toolsRef,
  }), [])

  const activeSection = useScrollSection(sectionRefs)
  useCardEffects()
  const glowRef = useCursorGlow()

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <div className="portfolio">
      {snapshot && <BuildHud snapshot={snapshot} onSkip={skip} />}

      <div ref={glowRef} className="portfolio__cursor-glow" aria-hidden="true" />
      <motion.div className="portfolio__progress" style={{ scaleX: progress }} aria-hidden="true" />

      <DotNavigation activeSection={activeSection} />
      <CommandPalette />
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
