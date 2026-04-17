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

      <Header sectionRef={heroRef} />

      <main className="portfolio__main">
        <Resume sectionRef={resumeRef} />
        <Projects sectionRef={projectsRef} />
        <ToolsSection sectionRef={toolsRef} />
      </main>

      <ScrollToTop />
    </div>
  )
}

export default Portfolio
