import React, { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import GlowOrb from './GlowOrb'
import ContactDialog from './ContactDialog'
import './Header.css'

interface HeaderProps {
  sectionRef?: React.RefObject<HTMLElement | null>
}

const Header: React.FC<HeaderProps> = ({ sectionRef }) => {
  const [contactOpen, setContactOpen] = useState(false)
  const orbRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const roleRef = useRef<HTMLParagraphElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            orbRef.current,
            eyebrowRef.current,
            nameRef.current,
            dividerRef.current,
            roleRef.current,
            linksRef.current,
            scrollCueRef.current,
          ],
          { opacity: 1, y: 0, scaleX: 1 }
        )
        return
      }

      gsap.set(
        [
          orbRef.current,
          eyebrowRef.current,
          nameRef.current,
          dividerRef.current,
          roleRef.current,
          linksRef.current,
          scrollCueRef.current,
        ],
        { opacity: 0 }
      )

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(orbRef.current, { opacity: 1, duration: 0.8 }, 0)
        .fromTo(eyebrowRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
        .fromTo(nameRef.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9 }, 0.35)
        .fromTo(dividerRef.current, { opacity: 1, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.4 }, 0.75)
        .fromTo(roleRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 0.85)
        .fromTo(linksRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.0)
        .to(scrollCueRef.current, { opacity: 1, duration: 0.6 }, 1.3)
    })

    return () => ctx.revert()
  }, [])

  const scrollToProjects = useCallback(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const scrollToResume = useCallback(() => {
    document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
    <header
      id="hero"
      ref={sectionRef as React.RefObject<HTMLElement | null>}
      className="hero"
    >
      <div className="hero__grid-bg" aria-hidden="true" />
      <div ref={orbRef}><GlowOrb /></div>

      <div className="hero__content">
        <div ref={eyebrowRef} className="hero__eyebrow" aria-hidden="true">
          // Portfolio
        </div>
        <h1 ref={nameRef} className="hero__name">
          Mikee
          <br />
          <span className="hero__name--accent">Quimson</span>
        </h1>
        <div ref={dividerRef} className="hero__divider" aria-hidden="true" />
        <p ref={roleRef} className="hero__role">
          Senior Solutions Architect &amp; Full Stack Developer
        </p>
        <a href="mailto:michaelpaulquimson@gmail.com" className="hero__email">
          michaelpaulquimson@gmail.com
        </a>
        <div ref={linksRef} className="hero__links">
          <button
            type="button"
            className="hero__cta hero__cta--primary"
            onClick={scrollToProjects}
          >
            View Work
          </button>
          <button
            type="button"
            className="hero__cta hero__cta--ghost"
            onClick={scrollToResume}
          >
            Resume
          </button>
          <button
            type="button"
            className="hero__cta hero__cta--ghost"
            onClick={() => setContactOpen(true)}
          >
            Contact
          </button>
        </div>
      </div>

      <div ref={scrollCueRef} className="hero__scroll-cue" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span>Scroll</span>
      </div>
    </header>

    <ContactDialog isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}

export default Header
