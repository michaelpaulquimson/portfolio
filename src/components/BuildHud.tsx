import React, { useEffect } from 'react'
import { BUILD_COMMAND } from '../hooks/useBuildDirector'
import type { BuildSnapshot } from '../hooks/useBuildDirector'
import './BuildHud.css'

interface BuildHudProps {
  snapshot: BuildSnapshot
  onSkip: () => void
}

const STATUS_LABEL = { allocating: 'ALLOCATING', building: 'BUILDING', ready: 'READY' } as const

const BuildHud: React.FC<BuildHudProps> = ({ snapshot, onSkip }) => {
  const { phase, typed, tokens, done, total, agents, sectors } = snapshot

  const percent = total > 0 ? Math.floor((done / total) * 100) : 0
  // Panel while agents are actually working; it folds to a pill when they idle (waiting for scroll).
  const working = phase === 'boot' || agents.some((a) => a.active)
  const hero = sectors.find((s) => s.id === 'hero')
  const heroReady = hero?.status === 'ready'
  const heroPercent = hero && hero.total > 0 ? Math.floor((hero.done / hero.total) * 100) : 0
  const spawned = phase !== 'boot'
  const finished = phase === 'done'

  useEffect(() => {
    if (finished) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finished, onSkip])

  return (
    <>
      {/* In-page layer: sector frames + agent chips sit on the real page, in page coordinates */}
      <div className="bld-layer" aria-hidden="true">
        {sectors
          .filter((s) => s.framed && s.height > 0)
          .map((s) => (
            <div
              key={s.id}
              className={`bld-frame bld-frame--${s.status}`}
              style={{ top: s.top, left: s.left, width: s.width, height: s.height }}
            >
              <span className="bld-frame__tag">
                [SECTOR: {s.label.toUpperCase()}] · {STATUS_LABEL[s.status]}
              </span>
              <span className="bld-frame__corner bld-frame__corner--tl" />
              <span className="bld-frame__corner bld-frame__corner--tr" />
              <span className="bld-frame__corner bld-frame__corner--bl" />
              <span className="bld-frame__corner bld-frame__corner--br" />
            </div>
          ))}

        {agents.map((a) => (
          <div
            key={a.id}
            className={`bld-chip bld-chip--${a.id}${a.active ? ' bld-chip--active' : ''}`}
            style={{ transform: `translate(${a.x}px, ${a.y}px)` }}
          >
            <span className="bld-chip__glyph" />
            {a.id.toUpperCase()} <span className="bld-chip__verb">{a.verb.toUpperCase()}</span>
          </div>
        ))}
      </div>

      {/* Fixed HUD */}
      <div className="bld-hud" role="status" aria-live="off" aria-label={`Page build ${percent}% complete`}>
        {!heroReady && !finished && (
          <div className="bld-terminal" aria-hidden="true">
            <div className="bld-terminal__cmd">
              <span className="bld-terminal__prompt">→ ~</span> {typed}
              {typed.length < BUILD_COMMAND.length && <span className="bld-terminal__caret" />}
            </div>
            {spawned && <div className="bld-terminal__ok">✓ 4 agents spawned · building first screen · {heroPercent}%</div>}
          </div>
        )}

        {working && !finished ? (
          <aside className="bld-panel">
            <div className="bld-panel__head">
              <span>GENESIS</span>
              <span className="bld-panel__accent">
                {percent}% · TASK {done}/{total} · 4 AGENTS
              </span>
            </div>
            <div className="bld-panel__meter">
              <div className="bld-panel__meter-fill" style={{ transform: `scaleX(${percent / 100})` }} />
            </div>

            <div className="bld-panel__agents">
              {agents.map((a) => (
                <div key={a.id} className={`bld-agent bld-agent--${a.id}${a.active ? ' bld-agent--active' : ''}`}>
                  <span className="bld-agent__name">
                    <span className="bld-chip__glyph" />
                    {a.id}
                  </span>
                  <span className="bld-agent__task">{a.active ? `${a.verb} ${a.target}` : 'thinking…'}</span>
                </div>
              ))}
            </div>

            <ol className="bld-panel__sectors">
              {sectors.map((s) => (
                <li key={s.id} className={`bld-sector bld-sector--${s.status}`}>
                  <div className="bld-sector__row">
                    <span>
                      <span className="bld-sector__num">{String(s.index + 1).padStart(2, '0')}</span> {s.label} ·{' '}
                      {s.brief}
                    </span>
                    <span className="bld-sector__count">
                      {s.done}/{s.total}
                    </span>
                  </div>
                  <div className="bld-sector__bar">
                    <div
                      className="bld-sector__bar-fill"
                      style={{ transform: `scaleX(${s.total ? s.done / s.total : 0})` }}
                    />
                  </div>
                </li>
              ))}
            </ol>

            <div className="bld-panel__foot">
              <span>{tokens.toLocaleString()} tokens</span>
              <button type="button" className="bld-skip" onClick={onSkip}>
                ▸▸ FF
              </button>
            </div>
          </aside>
        ) : (
          <div className={`bld-pill${finished ? ' bld-pill--done' : ''}`}>
            {finished ? (
              <>
                <span className="bld-pill__accent">✓ 100%</span> built live by 4 agents · {tokens.toLocaleString()}{' '}
                tokens
                <button type="button" className="bld-skip" onClick={() => window.location.reload()}>
                  ↻ replay
                </button>
              </>
            ) : (
              <>
                <span className="bld-pill__accent">{percent}%</span> built · scroll to build more
                <button type="button" className="bld-skip" onClick={onSkip}>
                  ▸▸ FF
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default BuildHud
