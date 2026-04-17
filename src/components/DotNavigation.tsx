import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
          <AnimatePresence>
            {activeSection === id && (
              <motion.span
                className="dot-nav__label"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.2 }}
              >
                {sectionLabels[id]}
              </motion.span>
            )}
          </AnimatePresence>
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
