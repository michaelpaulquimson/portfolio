import React, { useState, useEffect, useRef } from 'react'
import { Linkedin, Mail, Phone, MapPin, QrCode, FileText, Globe, FolderOpen, Layers } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useGSAP } from '../hooks/useGSAP'
import gsap from 'gsap'
import './Header.css'

const Header: React.FC = () => {
  const { isDarkMode } = useTheme()
  const [showHeaderNav, setShowHeaderNav] = useState(true)
  const headerRef = useRef<HTMLDivElement>(null)

  // GSAP Animations
  useGSAP(() => {
    if (!headerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.name', {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: 'power4.out'
      })
      .from('.title', {
        opacity: 0,
        y: 50,
        duration: 0.8
      }, '-=0.6')
      .from('.contact-item', {
        opacity: 0,
        x: -50,
        duration: 0.6,
        stagger: 0.1
      }, '-=0.4')
      .from('.social-links', {
        opacity: 0,
        scale: 0.8,
        duration: 0.6
      }, '-=0.3')
      .from('.header-nav', {
        opacity: 0,
        y: 30,
        duration: 0.5
      }, '-=0.3')

      // Parallax effect for background orbs
      gsap.to('.orb-1', {
        y: -50,
        x: 30,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      gsap.to('.orb-2', {
        y: 40,
        x: -30,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      gsap.to('.orb-3', {
        y: -40,
        x: 20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }, headerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const headerElement = document.querySelector('.header')
      if (headerElement) {
        const headerRect = headerElement.getBoundingClientRect()
        setShowHeaderNav(headerRect.bottom > 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      ref={headerRef}
      className={`header ${isDarkMode ? 'dark' : 'light'}`}
    >
      <div className="header-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="header-content">
        <div className="hero-section">
          <h1 className="name">
            MICHAEL PAUL QUIMSON
          </h1>
          <div className="title">
            <span className="title-text">Senior Solutions Architect</span>
            <span className="title-accent">Full Stack Developer</span>
          </div>
        </div>

        <div className="contact-info">
          <div className="contact-item">
            <MapPin size={18} />
            <span>Brookside Hills Subdivision, Cainta, Rizal 1900</span>
          </div>
          <div className="contact-item">
            <Phone size={18} />
            <span>(63) 905-6691964</span>
          </div>
          <div className="contact-item">
            <Mail size={18} />
            <span>michaelpaulquimson@gmail.com</span>
          </div>
        </div>

        <div className="social-links">
          <a
            href="https://www.linkedin.com/in/michaelpaulquimson/"
            className="social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={24} />
          </a>
        </div>

        {showHeaderNav && (
          <nav className="header-nav">
            <button
              className="nav-link"
              onClick={() => document.querySelector('.resume')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <FileText size={18} />
              <span>Resume</span>
            </button>
            <button
              className="nav-link"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Layers size={18} />
              <span>Projects</span>
            </button>
            <button
              className="nav-link"
              onClick={() => document.querySelector('.qr-generator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <QrCode size={18} />
              <span>QR Generator</span>
            </button>
            <button
              className="nav-link"
              onClick={() => document.querySelector('.api-tester')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Globe size={18} />
              <span>API Tester</span>
            </button>
            <button
              className="nav-link"
              onClick={() => document.querySelector('.file-processor')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <FolderOpen size={18} />
              <span>File Tools</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
