import { useState, useEffect } from 'react'
import type { RefObject } from 'react'
import type { SectionId } from '../constants/designTokens'
import { sections } from '../constants/designTokens'

export type SectionRefs = Record<SectionId, RefObject<HTMLElement | null>>

/**
 * Active section = the one crossing the middle of the viewport.
 * Reads refs on every scroll so lazy-loaded sections count once they mount,
 * and tall sections (taller than the viewport) still register.
 */
export function useScrollSection(refs: SectionRefs): SectionId {
  const [activeSection, setActiveSection] = useState<SectionId>('hero')

  useEffect(() => {
    let raf = 0

    const measure = () => {
      raf = 0
      const mid = window.innerHeight / 2
      let current: SectionId = sections[0]
      sections.forEach((id) => {
        const el = refs[id].current
        if (el && el.getBoundingClientRect().top <= mid) current = id
      })
      // A short last section can never reach the middle: at the page bottom it wins.
      const last = sections[sections.length - 1]
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom && refs[last].current) current = last
      setActiveSection(current)
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [refs])

  return activeSection
}
