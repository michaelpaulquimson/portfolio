import { useEffect } from 'react'

const SELECTOR = '.featured-card, .project-card'
const MAX_TILT_DEG = 5

/**
 * Pointer-driven card effects via event delegation, so cards that mount later
 * (lazy Projects, filter changes) work without per-card listeners.
 * Writes CSS vars only: --mx/--my (spotlight, %) and --rx/--ry (tilt, deg).
 */
export const useCardEffects = (): void => {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine) return

    let active: HTMLElement | null = null

    const reset = (el: HTMLElement | null) => {
      if (!el) return
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }

    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>(SELECTOR) ?? null
      if (card !== active) {
        reset(active)
        active = card
      }
      if (!card) return
      const r = card.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      card.style.setProperty('--mx', `${px * 100}%`)
      card.style.setProperty('--my', `${py * 100}%`)
      if (!reduce) {
        card.style.setProperty('--ry', `${(px - 0.5) * 2 * MAX_TILT_DEG}deg`)
        card.style.setProperty('--rx', `${(0.5 - py) * 2 * MAX_TILT_DEG}deg`)
      }
    }

    const onLeave = () => {
      reset(active)
      active = null
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])
}
