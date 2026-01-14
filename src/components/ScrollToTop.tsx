import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import './ScrollToTop.css'

/**
 * ScrollToTop Component
 *
 * A floating button that appears when the user scrolls down,
 * allowing quick navigation back to the top of the page.
 *
 * Features:
 * - Appears after scrolling 400px
 * - Smooth scroll animation
 * - Matches editorial design aesthetic
 * - Fully accessible with keyboard support
 */
const ScrollToTop: React.FC = () => {
  const { isDarkMode } = useTheme()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 400px
      if (window.scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Check initial scroll position
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className={`scroll-to-top ${isDarkMode ? 'dark' : 'light'}`}
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTop
