import { useLayoutEffect, useMemo, useSyncExternalStore } from 'react'

/**
 * Build director: makes the real page assemble itself in front of the visitor.
 *
 * Each sector (page section) owns a list of "units" (real DOM elements). A unit goes
 *   pending  → invisible, layout kept
 *   scaffold → dashed outline only, an agent chip parks on it
 *   reveal   → content materialises
 *   (done)   → attribute removed, element is exactly what React rendered
 * State is written to a `data-bld` attribute, never to className, so React re-renders
 * cannot wipe it and a missed cleanup can never leave content hidden behind a class.
 */

export type AgentId = 'layout' | 'type' | 'render' | 'wire'
export type SectorStatus = 'allocating' | 'building' | 'ready'

export interface AgentView {
  id: AgentId
  label: string
  verb: string
  target: string
  x: number
  y: number
  active: boolean
  /** true while the agent is on an ambient (post-build) visit rather than building */
  ambient: boolean
}

export interface SectorView {
  id: string
  index: number
  label: string
  brief: string
  done: number
  total: number
  status: SectorStatus
  framed: boolean
  top: number
  left: number
  width: number
  height: number
}

export interface BuildSnapshot {
  phase: 'boot' | 'building' | 'done'
  typed: string
  tokens: number
  done: number
  total: number
  agents: AgentView[]
  sectors: SectorView[]
  /** any agent currently on an ambient visit */
  ambient: boolean
  /** last ambient task, kept after the visit ends so the HUD does not flicker */
  activity: string
}

interface SectorDef {
  id: string
  label: string
  brief: string
  selector: string
  stagger: number
  scaffold: number
}

interface Unit {
  el: HTMLElement
  agent: AgentId
  target: string
  /** fully revealed; eligible for ambient visits */
  built: boolean
}

interface SectorRuntime {
  def: SectorDef
  index: number
  el: HTMLElement
  units: Unit[]
  done: number
  status: SectorStatus
  started: boolean
  framed: boolean
}

export const BUILD_COMMAND = 'build --agents=4 --target=portfolio --message="ship it live, in front of them"'

const SECTORS: SectorDef[] = [
  {
    id: 'hero',
    label: 'hero',
    brief: 'make the first screen count',
    selector: '[data-build]',
    stagger: 300,
    scaffold: 440,
  },
  {
    id: 'resume',
    label: 'experience',
    brief: 'the track record, no filler',
    selector:
      '.section-label, .resume__title, .resume__summary, .stat, .block-title, .journey__step, .role, .skill-row, .tool-row, .edu-cert__card',
    stagger: 240,
    scaffold: 650,
  },
  {
    id: 'projects',
    label: 'work',
    brief: 'the work, shipped and live',
    selector: '.section-label, .projects__title, .projects__intro, .filter-pill, .featured-card, .project-card',
    stagger: 380,
    scaffold: 800,
  },
  {
    id: 'tools',
    label: 'tools',
    brief: 'utilities that run in the browser',
    selector: '.section-label, .tools-section__title, .tools-section__toggle',
    stagger: 420,
    scaffold: 700,
  },
]

const AGENT_ORDER: AgentId[] = ['layout', 'type', 'render', 'wire']

const VERBS: Record<AgentId, string[]> = {
  layout: ['scaffolding', 'measuring', 'aligning', 'structuring'],
  type: ['typesetting', 'kerning', 'writing', 'tightening'],
  render: ['rendering', 'shading', 'lighting', 'compositing'],
  wire: ['wiring', 'binding', 'connecting', 'testing'],
}

// Refinement verbs for ambient visits to already-built units.
const AMBIENT_VERBS: Record<AgentId, string[]> = {
  layout: ['re-measuring', 'aligning', 'tightening spacing', 'checking overflow'],
  type: ['kerning', 'proofreading', 'tightening', 'rebalancing'],
  render: ['polishing', 'checking contrast', 'shading', 'compositing'],
  wire: ['re-testing', 'checking links', 'tuning', 'profiling'],
}

const BOOT_MS = 750
const REVEAL_MS = 520
const FRAME_LINGER_MS = 1300
// Ambient work: one visit every AMBIENT_MIN..MAX ms, outline lasts POLISH_MS, chip lingers a little longer.
const AMBIENT_MIN_MS = 1500
const AMBIENT_MAX_MS = 3000
const AMBIENT_PAIR_GAP_MS = 380
const POLISH_MS = 800
const CHIP_LINGER_MS = 250
// Under load (several units waiting) builds compress so content is never hidden for long.
const RUSH_QUEUE = 3
const RUSH_BUDGET_MS = 900
const RUSH_SCAFFOLD_MS = 420

const pick = <T,>(arr: T[], n: number): T => arr[n % arr.length]

const inferAgent = (el: HTMLElement): AgentId => {
  const hint = el.dataset.build
  if (hint === 'layout' || hint === 'type' || hint === 'render' || hint === 'wire') return hint
  if (/^(H1|H2|H3|P)$/.test(el.tagName)) return 'type'
  if (el.matches('.featured-card, .project-card')) return 'render'
  if (el.matches('button, a, .skill-chip, .filter-pill')) return 'wire'
  if (el.matches('[class*="label"], [class*="title"], [class*="summary"]')) return 'type'
  return 'layout'
}

const describe = (el: HTMLElement): string => {
  if (el.querySelector('canvas') || el.dataset.build === 'render') return 'canvas webgl'
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
  const short = text.length > 22 ? `${text.slice(0, 21)}…` : text
  return `${el.tagName.toLowerCase()} "${short}"`
}

const emptySnapshot = (): BuildSnapshot => ({
  phase: 'boot',
  typed: '',
  tokens: 0,
  done: 0,
  total: 0,
  agents: AGENT_ORDER.map((id) => ({
    id,
    label: `agent/${id}`,
    verb: 'idle',
    target: '',
    x: 0,
    y: 0,
    active: false,
    ambient: false,
  })),
  sectors: [],
  ambient: false,
  activity: '',
})

class BuildDirector {
  private listeners = new Set<() => void>()
  private snapshot: BuildSnapshot = emptySnapshot()
  private sectors: SectorRuntime[] = []
  private agents = new Map<AgentId, AgentView & { seq: number }>()
  private timers = new Set<number>()
  private mo: MutationObserver | null = null
  private io: IntersectionObserver | null = null
  private queue: { sector: SectorRuntime; unit: Unit }[] = []
  private pumping = false
  private ro: ResizeObserver | null = null
  private raf = 0
  private sweepRaf = 0
  private phase: BuildSnapshot['phase'] = 'boot'
  private typed = ''
  private tokens = 0
  private verbSeq = 0
  private skipped = false
  private ambientOn = false
  private activity = ''

  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  getSnapshot = (): BuildSnapshot => this.snapshot

  start(): void {
    this.reset()
    AGENT_ORDER.forEach((id) =>
      this.agents.set(id, {
        id,
        label: `agent/${id}`,
        verb: 'idle',
        target: '',
        x: 0,
        y: 0,
        active: false,
        ambient: false,
        seq: 0,
      })
    )

    this.ro = new ResizeObserver(() => this.emit())
    // Below the hero, each component is built the moment it scrolls into view.
    this.io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          this.io?.unobserve(entry.target)
          this.enqueue(entry.target as HTMLElement)
        })
      },
      // threshold 0: fires for any element that enters the viewport, however tall it is
      { threshold: 0, rootMargin: '0px 0px -6% 0px' }
    )
    this.registerAvailable()
    // Lazy sections mount later; register them the moment they hit the DOM (before paint).
    // The observer stays on for the whole session: units can also leave the DOM (project filter) or arrive later.
    this.mo = new MutationObserver(() => {
      if (this.sectors.length < SECTORS.length) this.registerAvailable()
      this.scheduleSweep()
    })
    this.mo.observe(document.body, { childList: true, subtree: true })

    // Boot: type the command, then spawn agents and start on the hero.
    const startedAt = performance.now()
    const type = () => {
      const t = Math.min(1, (performance.now() - startedAt) / BOOT_MS)
      this.typed = BUILD_COMMAND.slice(0, Math.round(t * BUILD_COMMAND.length))
      this.emit()
      if (t < 1) {
        this.raf = requestAnimationFrame(type)
        return
      }
      this.after(180, () => {
        this.phase = 'building'
        const hero = this.sectors.find((s) => s.def.id === 'hero')
        if (hero) this.beginSector(hero)
        this.pump()
        this.emit()
      })
    }
    this.raf = requestAnimationFrame(type)
    window.addEventListener('resize', this.onResize)
    window.addEventListener('scroll', this.wakeAmbient, { passive: true })
    document.addEventListener('visibilitychange', this.wakeAmbient)
  }

  /** Fast-forward: everything appears now. */
  skip = (): void => {
    if (this.phase === 'done') return
    this.skipped = true
    this.queue = []
    this.pumping = false
    this.io?.disconnect()
    this.clearTimers()
    cancelAnimationFrame(this.raf)
    this.typed = BUILD_COMMAND
    this.ambientOn = false
    this.sectors.forEach((s) => {
      s.units.forEach((u) => {
        u.el.removeAttribute('data-bld')
        u.built = true
      })
      this.tokens += (s.units.length - s.done) * 1240
      s.done = s.units.length
      s.status = 'ready'
      s.started = true
      s.framed = false
    })
    this.agents.forEach((a) => {
      a.active = false
      a.ambient = false
    })
    this.phase = 'done'
    this.emit()
    // Ambient refinement may carry on after a skip.
    this.wakeAmbient()
  }

  dispose(): void {
    this.reset()
    this.listeners.clear()
  }

  private reset(): void {
    this.clearTimers()
    cancelAnimationFrame(this.raf)
    cancelAnimationFrame(this.sweepRaf)
    this.sweepRaf = 0
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('scroll', this.wakeAmbient)
    document.removeEventListener('visibilitychange', this.wakeAmbient)
    this.ambientOn = false
    this.activity = ''
    this.mo?.disconnect()
    this.ro?.disconnect()
    this.io?.disconnect()
    this.mo = this.ro = this.io = null
    this.queue = []
    this.pumping = false
    this.sectors.forEach((s) => s.units.forEach((u) => u.el.removeAttribute('data-bld')))
    this.sectors = []
    this.agents.clear()
    this.phase = 'boot'
    this.typed = ''
    this.tokens = 0
    this.skipped = false
    this.snapshot = emptySnapshot()
  }

  private onResize = (): void => {
    this.emit()
    this.wakeAmbient()
  }

  /** Starts the ambient loop if it is asleep. Cheap no-op while running, hidden, or still booting. */
  private wakeAmbient = (): void => {
    if (this.ambientOn || document.hidden || this.phase === 'boot' || this.sectors.length === 0) return
    this.ambientOn = true
    this.after(AMBIENT_MIN_MS, this.ambientTick)
  }

  /** One ambient beat. Sleeps (no timer) when the tab is hidden or no built unit is in view. */
  private ambientTick = (): void => {
    if (document.hidden || this.visibleBuilt().length === 0) {
      this.ambientOn = false
      return
    }
    this.visit()
    if (Math.random() < 0.4) this.after(AMBIENT_PAIR_GAP_MS, () => this.visit())
    this.after(AMBIENT_MIN_MS + Math.random() * (AMBIENT_MAX_MS - AMBIENT_MIN_MS), this.ambientTick)
  }

  /** Built units that are on screen right now and not mid-build or mid-visit. */
  private visibleBuilt(): Unit[] {
    const vh = window.innerHeight
    const out: Unit[] = []
    this.sectors.forEach((s) =>
      s.units.forEach((u) => {
        if (!u.built || !u.el.isConnected || u.el.hasAttribute('data-bld')) return
        const r = u.el.getBoundingClientRect()
        if (r.width > 0 && r.height > 0 && r.bottom > 40 && r.top < vh - 40) out.push(u)
      })
    )
    return out
  }

  /** An idle agent hops onto a built unit, which gets a brief attribute-driven outline. */
  private visit(): void {
    if (document.hidden) return
    const unit = (() => {
      const c = this.visibleBuilt()
      return c.length ? c[Math.floor(Math.random() * c.length)] : null
    })()
    const idle = AGENT_ORDER.filter((id) => !this.agents.get(id)?.active)
    if (!unit || idle.length === 0) return
    const id = idle.includes(unit.agent) ? unit.agent : idle[Math.floor(Math.random() * idle.length)]
    const agent = this.agents.get(id)
    if (!agent) return

    agent.seq += 1
    const seq = agent.seq
    agent.verb = pick(AMBIENT_VERBS[id], this.verbSeq++)
    agent.target = unit.target
    this.park(agent, unit)
    agent.ambient = true
    this.activity = `${id} ${agent.verb} ${unit.target}`
    this.tokens += 40 + Math.round(Math.random() * 120)
    unit.el.setAttribute('data-bld', 'polish')
    this.emit()

    this.after(POLISH_MS, () => {
      if (unit.el.getAttribute('data-bld') === 'polish') unit.el.removeAttribute('data-bld')
    })
    this.after(POLISH_MS + CHIP_LINGER_MS, () => {
      if (agent.seq !== seq) return
      agent.active = false
      agent.ambient = false
      this.emit()
    })
  }

  private park(agent: AgentView, unit: Unit): void {
    const r = unit.el.getBoundingClientRect()
    agent.x = Math.max(8, Math.min(r.left + window.scrollX + 12, window.innerWidth - 240))
    agent.y = Math.max(8, r.top + window.scrollY - 13)
    agent.active = true
  }

  private after(ms: number, fn: () => void): void {
    const id = window.setTimeout(() => {
      this.timers.delete(id)
      fn()
    }, ms)
    this.timers.add(id)
  }

  private clearTimers(): void {
    this.timers.forEach((id) => window.clearTimeout(id))
    this.timers.clear()
  }

  private registerAvailable(): void {
    SECTORS.forEach((def, index) => {
      if (this.sectors.some((s) => s.def.id === def.id)) return
      const el = document.getElementById(def.id)
      if (!el) return

      const units: Unit[] = Array.from(el.querySelectorAll<HTMLElement>(def.selector))
        .filter((node) => node.getClientRects().length > 0)
        .map((node) => ({ el: node, agent: inferAgent(node), target: describe(node), built: this.skipped }))

      const sector: SectorRuntime = {
        def,
        index,
        el,
        units,
        done: this.skipped ? units.length : 0,
        status: this.skipped ? 'ready' : 'allocating',
        started: this.skipped,
        framed: !this.skipped,
      }
      if (!this.skipped) units.forEach((u) => u.el.setAttribute('data-bld', 'pending'))

      this.sectors.push(sector)
      this.sectors.sort((a, b) => a.index - b.index)
      this.ro?.observe(el)
      if (!this.skipped && def.id !== 'hero') units.forEach((u) => this.io?.observe(u.el))
    })
    this.emit()
  }

  private enqueue(el: HTMLElement): void {
    for (const sector of this.sectors) {
      const unit = sector.units.find((u) => u.el === el)
      if (!unit) continue
      this.queue.push({ sector, unit })
      this.pump()
      return
    }
  }

  /** Starts queued components one after another so agents visibly work through them. */
  private pump(): void {
    if (this.pumping || this.phase !== 'building') return
    let next = this.queue.shift()
    while (next && (!next.unit.el.isConnected || !next.sector.units.includes(next.unit))) {
      this.dropUnit(next.sector, next.unit)
      next = this.queue.shift()
    }
    if (!next) return
    this.pumping = true
    if (next.sector.status === 'allocating') {
      next.sector.status = 'building'
      next.sector.started = true
    }
    // Watchable pace normally; when several units are waiting (fast scroll) compress so nothing stays hidden.
    const waiting = this.queue.length
    const rush = waiting >= RUSH_QUEUE
    this.startUnit(next.sector, next.unit, rush)
    this.after(Math.min(next.sector.def.stagger, RUSH_BUDGET_MS / (waiting + 1)), () => {
      this.pumping = false
      this.pump()
    })
  }

  private beginSector(sector: SectorRuntime): void {
    if (sector.started) return
    sector.started = true
    sector.status = 'building'
    if (sector.units.length === 0) {
      this.finishSector(sector)
      return
    }
    sector.units.slice().forEach((unit, i) => this.after(i * sector.def.stagger, () => this.startUnit(sector, unit)))
    this.emit()
  }

  private startUnit(sector: SectorRuntime, unit: Unit, rush = false): void {
    if (this.skipped || !sector.units.includes(unit)) return
    if (!unit.el.isConnected) {
      this.dropUnit(sector, unit)
      return
    }
    unit.el.setAttribute('data-bld', 'scaffold')

    const agent = this.agents.get(unit.agent)
    let seq = 0
    if (agent) {
      agent.seq += 1
      seq = agent.seq
      agent.verb = pick(VERBS[unit.agent], this.verbSeq++)
      agent.target = unit.target
      this.park(agent, unit)
      agent.ambient = false
    }
    this.emit()

    // The 3D scene is the slow one: let its scaffold box read before it renders.
    const baseScaffold = unit.agent === 'render' ? sector.def.scaffold * 2 : sector.def.scaffold
    const scaffoldMs = rush ? Math.min(baseScaffold, RUSH_SCAFFOLD_MS) : baseScaffold
    this.after(scaffoldMs, () => {
      if (!sector.units.includes(unit)) return
      if (!unit.el.isConnected) {
        this.dropUnit(sector, unit)
        return
      }
      unit.el.setAttribute('data-bld', 'reveal')
      this.after(REVEAL_MS, () => {
        if (!sector.units.includes(unit)) return
        unit.el.removeAttribute('data-bld')
        unit.built = true
        sector.done += 1
        this.tokens += 700 + Math.round(Math.random() * 1200)
        if (agent && agent.seq === seq) agent.active = false
        this.settle(sector)
        this.emit()
        this.wakeAmbient()
      })
    })
  }

  /** Removes a unit that left the DOM (or was never reachable) and re-evaluates sector completion. */
  private dropUnit(sector: SectorRuntime, unit: Unit): void {
    const i = sector.units.indexOf(unit)
    if (i === -1) return
    sector.units.splice(i, 1)
    if (unit.built) sector.done = Math.max(0, sector.done - 1)
    this.io?.unobserve(unit.el)
    unit.el.removeAttribute('data-bld')
    const agent = this.agents.get(unit.agent)
    if (agent && agent.target === unit.target) {
      agent.seq += 1
      agent.active = false
      agent.ambient = false
    }
    this.settle(sector)
    this.emit()
  }

  /** A sector is ready once it has started and every remaining unit is built, or when nothing is left in it. */
  private settle(sector: SectorRuntime): void {
    if (sector.status === 'ready') return
    if (sector.units.length === 0) {
      sector.started = true
      this.finishSector(sector)
    } else if (sector.started && sector.done >= sector.units.length) {
      this.finishSector(sector)
    }
  }

  private scheduleSweep(): void {
    if (this.sweepRaf) return
    this.sweepRaf = requestAnimationFrame(() => {
      this.sweepRaf = 0
      this.sweep()
    })
  }

  /** Drops units that left the DOM; adopts new matching nodes as already-built (visible, never hidden). */
  private sweep(): void {
    let changed = false
    this.sectors.forEach((sector) => {
      sector.units.slice().forEach((u) => {
        if (u.el.isConnected) return
        this.queue = this.queue.filter((q) => q.unit !== u)
        this.dropUnit(sector, u)
        changed = true
      })
      if (!sector.el.isConnected) return
      const known = new Set(sector.units.map((u) => u.el))
      sector.el.querySelectorAll<HTMLElement>(sector.def.selector).forEach((node) => {
        if (known.has(node) || node.hasAttribute('data-bld') || node.getClientRects().length === 0) return
        sector.units.push({ el: node, agent: inferAgent(node), target: describe(node), built: true })
        sector.done += 1
        changed = true
      })
    })
    if (changed) this.emit()
  }

  private finishSector(sector: SectorRuntime): void {
    if (sector.status === 'ready') return
    sector.status = 'ready'
    this.after(FRAME_LINGER_MS, () => {
      sector.framed = false
      this.emit()
    })
    if (this.sectors.length === SECTORS.length && this.sectors.every((s) => s.status === 'ready')) {
      this.phase = 'done'
    }
    this.emit()
  }

  private emit(): void {
    this.snapshot = {
      phase: this.phase,
      typed: this.typed,
      tokens: this.tokens,
      done: this.sectors.reduce((n, s) => n + s.done, 0),
      total: this.sectors.reduce((n, s) => n + s.units.length, 0),
      agents: AGENT_ORDER.flatMap((id) => {
        const a = this.agents.get(id)
        return a
          ? [
              {
                id: a.id,
                label: a.label,
                verb: a.verb,
                target: a.target,
                x: a.x,
                y: a.y,
                active: a.active,
                ambient: a.ambient,
              },
            ]
          : []
      }),
      ambient: AGENT_ORDER.some((id) => this.agents.get(id)?.ambient),
      activity: this.activity,
      sectors: this.sectors.map((s) => {
        const r = s.framed ? s.el.getBoundingClientRect() : null
        return {
          id: s.def.id,
          index: s.index,
          label: s.def.label,
          brief: s.def.brief,
          done: s.done,
          total: s.units.length,
          status: s.status,
          framed: s.framed,
          top: r ? r.top + window.scrollY : 0,
          left: r ? r.left + window.scrollX : 0,
          width: r ? r.width : 0,
          height: r ? r.height : 0,
        }
      }),
    }
    this.listeners.forEach((fn) => fn())
  }
}

const noopSubscribe = (): (() => void) => () => {}
const nullSnapshot = (): null => null

export const useBuildDirector = (
  enabled: boolean
): { snapshot: BuildSnapshot | null; skip: () => void } => {
  const director = useMemo(() => (enabled ? new BuildDirector() : null), [enabled])

  // Layout effect: units are hidden before the first paint, so nothing flashes.
  useLayoutEffect(() => {
    if (!director) return
    director.start()
    return () => director.dispose()
  }, [director])

  const snapshot = useSyncExternalStore<BuildSnapshot | null>(
    director ? director.subscribe : noopSubscribe,
    director ? director.getSnapshot : nullSnapshot
  )

  return { snapshot, skip: director ? director.skip : noopSubscribe }
}
