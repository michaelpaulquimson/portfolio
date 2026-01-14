import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

/**
 * Custom hook for GSAP animations with automatic cleanup
 *
 * @param callback - Function containing GSAP animations
 * @param dependencies - Array of dependencies that trigger animation re-run
 *
 * @example
 * useGSAP(() => {
 *   gsap.from('.element', { opacity: 0, y: 50, duration: 1 })
 * }, [])
 */
export const useGSAP = (
  callback: (context?: gsap.Context) => void,
  dependencies: React.DependencyList = []
) => {
  const contextRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    // Create GSAP context for automatic cleanup
    contextRef.current = gsap.context(() => {
      callback(contextRef.current || undefined)
    }, document.body)

    // Cleanup function
    return () => {
      contextRef.current?.revert()
    }
  }, dependencies)

  return contextRef
}

/**
 * Utility function for fade-up stagger animations
 */
export const fadeUpStagger = (selector: string, options: Record<string, any> = {}) => {
  return gsap.from(selector, {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    ...(options as any),
    scrollTrigger: {
      trigger: selector,
      start: 'top 85%',
      toggleActions: 'play none none none',
      ...(options.scrollTrigger || {}),
    },
  })
}

/**
 * Utility function for parallax effects
 */
export const parallaxEffect = (selector: string, yDistance: number = 50) => {
  return gsap.to(selector, {
    y: yDistance,
    ease: 'none',
    scrollTrigger: {
      trigger: selector,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  })
}

/**
 * Utility function for scale-in animations
 */
export const scaleIn = (selector: string, options: Record<string, any> = {}) => {
  return gsap.from(selector, {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: 'power3.out',
    ...(options as any),
    scrollTrigger: {
      trigger: selector,
      start: 'top 85%',
      toggleActions: 'play none none none',
      ...(options.scrollTrigger || {}),
    },
  })
}

export default useGSAP
