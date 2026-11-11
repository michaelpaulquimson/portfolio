import React, { useState, useEffect, useCallback } from 'react'
import AgentActivity from './AgentActivity'
import ContactDialog from './ContactDialog'
import './Header.css'

interface HeaderProps {
  sectionRef?: React.RefObject<HTMLElement | null>
}

const Header: React.FC<HeaderProps> = ({ sectionRef }) => {
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    const open = () => setContactOpen(true)
    window.addEventListener('portfolio:contact', open)
    return () => window.removeEventListener('portfolio:contact', open)
  }, [])

  // Magnetic CTA buttons: they lean toward the cursor.
  const onMagnet = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * 0.25
    const y = (e.clientY - (r.top + r.height / 2)) * 0.35
    el.style.transform = `translate(${x}px, ${y}px)`
  }, [])
  const offMagnet = useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = ''
  }, [])

  const goTo = (id: string) => () =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const magnet = { onPointerMove: onMagnet, onPointerLeave: offMagnet }

  return (
    <>
      <header
        id="hero"
        ref={sectionRef as React.RefObject<HTMLElement | null>}
        className="hero"
      >
        <div className="hero__grid-bg" aria-hidden="true" />
        <div className="hero__vignette" aria-hidden="true" />

        <div className="hero__scene" data-build="render">
          <AgentActivity />
        </div>

        <div className="hero__content">
          <div className="hero__status" data-build="layout">
            <span className="hero__status-dot" aria-hidden="true" />
            Open to opportunities · Philippines
          </div>

          <h1 className="hero__name" data-build="type">
            Mikee
            <br />
            <span className="hero__name--accent">Quimson</span>
          </h1>

          <p className="hero__role" data-build="type">
            Senior Solutions Architect &amp; Full Stack Developer
          </p>

          <p className="hero__lede" data-build="type">
            I design and ship production systems end to end — and use AI as a force multiplier,
            not a shortcut.
          </p>

          <div className="hero__links">
            <button
              type="button"
              className="hero__cta hero__cta--primary"
              data-build="wire"
              onClick={goTo('projects')}
              {...magnet}
            >
              View Work
            </button>
            <button
              type="button"
              className="hero__cta hero__cta--ghost"
              data-build="wire"
              onClick={goTo('resume')}
              {...magnet}
            >
              Resume
            </button>
            <button
              type="button"
              className="hero__cta hero__cta--ghost"
              data-build="wire"
              onClick={() => setContactOpen(true)}
              {...magnet}
            >
              Contact
            </button>
          </div>

        </div>

        <div className="hero__scroll-cue" aria-hidden="true">
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </header>

      <ContactDialog isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}

export default Header
