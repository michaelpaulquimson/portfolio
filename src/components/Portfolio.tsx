import React from 'react'
import Header from './Header.tsx'
import Resume from './Resume.tsx'
import QRGenerator from './QRGenerator.tsx'
import './Portfolio.css'

const Portfolio: React.FC = () => {
  return (
    <div className="portfolio">
      <Header />
      <main className="main-content">
        <Resume />
        <QRGenerator />
      </main>
    </div>
  )
}

export default Portfolio
