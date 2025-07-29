import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, QrCode, Globe, FolderOpen } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import DarkModeToggle from './DarkModeToggle'
import './StickyNavigation.css'

const StickyNavigation: React.FC = () => {
  const { isDarkMode } = useTheme()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navItems = [
    { id: 'resume', icon: FileText, label: 'Resume' },
    { id: 'qr-generator', icon: QrCode, label: 'QR Generator' },
    { id: 'api-tester', icon: Globe, label: 'API Tester' },
    { id: 'file-processor', icon: FolderOpen, label: 'File Tools' },
  ]

  return (
    <>
      <motion.nav
        className={`sticky-nav ${isDarkMode ? 'dark' : 'light'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="nav-content">
          <div className="nav-items">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                className="nav-item"
                onClick={() => scrollToSection(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                title={item.label}
                aria-label={`Navigate to ${item.label}`}
              >
                <item.icon size={18} />
                <span className="nav-label">{item.label}</span>
              </motion.button>
            ))}
          </div>
          <div className="nav-controls">
            <DarkModeToggle />
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className={`scroll-to-top ${isDarkMode ? 'dark' : 'light'}`}
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <div className="scroll-icon">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f5ff" stopOpacity="1" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="15" fill="url(#scrollGradient)" stroke="#00f5ff" strokeWidth="2"/>
                <text x="16" y="22" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" textAnchor="middle" fill="white">MP</text>
              </svg>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

export default StickyNavigation
