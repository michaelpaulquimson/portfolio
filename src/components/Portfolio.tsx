import React from 'react'
import Header from './Header.tsx'
import Resume from './Resume.tsx'
import Projects from './Projects.tsx'
import QRGenerator from './QRGenerator.tsx'
import APITester from './APITester.tsx'
import FileProcessor from './FileProcessor.tsx'
import StickyNavigation from './StickyNavigation.tsx'
import ScrollToTop from './ScrollToTop.tsx'
import { useTheme } from '../contexts/ThemeContext'
import './Portfolio.css'

const Portfolio: React.FC = () => {
  const { isDarkMode } = useTheme()

  return (
    <div className={`portfolio ${isDarkMode ? 'dark' : 'light'}`}>
      <StickyNavigation />
      <Header />
      <main className="main-content">
        <Resume />
        <Projects />
        <QRGenerator />
        <APITester />
        <FileProcessor />
      </main>
      <ScrollToTop />
    </div>
  )
}

export default Portfolio
