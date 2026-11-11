import React, { useEffect, useRef, useState } from 'react'
import './AgentActivity.css'

type Tone = 'run' | 'ok' | 'info'

interface Step {
  tone: Tone
  text: string
}

const STEPS: Step[] = [
  { tone: 'info', text: 'agent online · planning task' },
  { tone: 'run', text: 'reading repo structure' },
  { tone: 'run', text: 'tracing the failing request' },
  { tone: 'ok', text: 'root cause found · 1 file' },
  { tone: 'run', text: 'writing the fix' },
  { tone: 'run', text: 'adding a regression test' },
  { tone: 'run', text: 'running the test suite' },
  { tone: 'ok', text: 'all checks passed' },
  { tone: 'info', text: 'review ready · waiting on a human' },
]

const VISIBLE = 6
const STEP_MS = 1500
const HOLD_MS = 3200

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const AgentActivity: React.FC = () => {
  const reduced = useRef(prefersReducedMotion()).current
  const [count, setCount] = useState(reduced ? STEPS.length : 1)
  const [run, setRun] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  // Pause the loop when the hero is off screen.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduced || !visible) return
    const done = count >= STEPS.length
    const id = window.setTimeout(
      () => {
        if (done) {
          setCount(1)
          setRun((r) => r + 1)
        } else {
          setCount((c) => c + 1)
        }
      },
      done ? HOLD_MS : STEP_MS,
    )
    return () => window.clearTimeout(id)
  }, [count, reduced, visible])

  const shown = STEPS.slice(Math.max(0, count - VISIBLE), count)
  const finished = count >= STEPS.length
  const progress = Math.round((count / STEPS.length) * 100)

  return (
    <div ref={wrapRef} className="agent" aria-hidden="true">
      <div className="agent__bar">
        <span className="agent__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="agent__title">agent · background task #{String(run + 1).padStart(2, '0')}</span>
        <span className={`agent__state${finished ? ' agent__state--done' : ''}`}>
          {finished ? 'idle' : 'working'}
        </span>
      </div>

      <ul className="agent__log">
        {shown.map((s, i) => {
          const index = count - shown.length + i
          const isLast = index === count - 1
          return (
            <li key={`${run}-${index}`} className={`agent__line agent__line--${s.tone}`}>
              <span className="agent__mark">
                {s.tone === 'ok' ? '✓' : s.tone === 'info' ? '·' : isLast && !finished ? '▸' : '✓'}
              </span>
              <span className="agent__text">{s.text}</span>
              {isLast && !finished && <span className="agent__cursor" />}
            </li>
          )
        })}
      </ul>

      <div className="agent__progress">
        <div className="agent__track">
          <div className="agent__fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="agent__pct">{progress}%</span>
      </div>
    </div>
  )
}

export default AgentActivity
