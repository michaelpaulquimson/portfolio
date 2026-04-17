import { useState, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { SectionId } from '../constants/designTokens'
import { sections } from '../constants/designTokens'

export type SectionRefs = Record<SectionId, RefObject<HTMLElement | null>>

export function useScrollSection(refs: SectionRefs): SectionId {
  const [activeSection, setActiveSection] = useState<SectionId>('hero')
  const observersRef = useRef<Map<SectionId, IntersectionObserver>>(new Map())

  useEffect(() => {
    const observers = observersRef.current

    sections.forEach((id) => {
      const el = refs[id].current
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { threshold: 0.4 }
      )

      observer.observe(el)
      observers.set(id, observer)
    })

    return () => {
      observers.forEach((o) => o.disconnect())
      observers.clear()
    }
  }, [refs])

  return activeSection
}
