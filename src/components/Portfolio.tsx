import React from 'react'
import Header from './Header.tsx'
import Resume from './Resume.tsx'
import QRGenerator from './QRGenerator.tsx'
import APITester from './APITester.tsx'
import FileProcessor from './FileProcessor.tsx'
import DarkModeToggle from './DarkModeToggle.tsx'
import { useTheme } from '../contexts/ThemeContext'
import './Portfolio.css'

const Portfolio: React.FC = () => {
  const { isDarkMode } = useTheme()

  return (
    <div className={`portfolio ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="dark-mode-toggle-container">
        <DarkModeToggle />
      </div>
      <Header />
      <main className="main-content">
        <Resume />
        <QRGenerator />
        <APITester />
        <FileProcessor />
      </main>
    </div>
  )
}

export default Portfolio
