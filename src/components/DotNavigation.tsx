import React from 'react'
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
          <span
            className={`dot-nav__label${activeSection === id ? ' dot-nav__label--active' : ''}`}
          >
            {sectionLabels[id]}
          </span>
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
