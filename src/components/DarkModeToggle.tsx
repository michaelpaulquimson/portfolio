import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import './DarkModeToggle.css'

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <button
      type="button"
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDarkMode}
    >
      <span className="dark-mode-toggle__icon" aria-hidden="true">
        {isDarkMode ? '☀' : '◑'}
      </span>
      {isDarkMode ? 'Light' : 'Dark'}
    </button>
  )
}

export default DarkModeToggle
