import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import './CommandPalette.css'

interface Command {
  id: string
  label: string
  hint: string
  run: () => void
}

const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const { isDarkMode, toggleDarkMode } = useTheme()

  const close = useCallback(() => setOpen(false), [])

  const scrollTo = (id: string) => () =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const commands: Command[] = useMemo(
    () => [
      { id: 'hero', label: 'Go to Home', hint: 'section', run: scrollTo('hero') },
      { id: 'resume', label: 'Go to Experience', hint: 'section', run: scrollTo('resume') },
      { id: 'projects', label: 'Go to Projects', hint: 'section', run: scrollTo('projects') },
      { id: 'tools', label: 'Go to Utility Tools', hint: 'section', run: scrollTo('tools') },
      {
        id: 'contact',
        label: 'Contact me',
        hint: 'dialog',
        run: () => window.dispatchEvent(new Event('portfolio:contact')),
      },
      {
        id: 'theme',
        label: isDarkMode ? 'Switch to light theme' : 'Switch to dark theme',
        hint: 'theme',
        run: toggleDarkMode,
      },
      {
        id: 'intro',
        label: 'Replay the live build',
        hint: 'intro',
        run: () => {
          window.location.reload()
        },
      },
      {
        id: 'github',
        label: 'Open GitHub',
        hint: 'external',
        run: () => window.open('https://github.com/michaelpaulquimson', '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'email',
        label: 'Send an email',
        hint: 'external',
        run: () => {
          window.location.href = 'mailto:michaelpaulquimson@gmail.com'
        },
      },
    ],
    [isDarkMode, toggleDarkMode]
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands
  }, [commands, query])

  // Global shortcut: Cmd/Ctrl+K toggles; "/" opens when not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName ?? '')
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === '/' && !typing && !open) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement | null
      setQuery('')
      setIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      returnFocus.current?.focus?.()
    }
  }, [open])

  const exec = (cmd: Command | undefined) => {
    if (!cmd) return
    close()
    // Wait a tick so focus restore doesn't fight scrolling.
    window.setTimeout(cmd.run, 50)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => (results.length ? (i + 1) % results.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      exec(results[index])
    } else if (e.key === 'Tab') {
      e.preventDefault() // focus stays in the input; arrows move the selection
    }
  }

  return (
    <>
      {open && (
        <div className="cmdk" onMouseDown={close}>
          <div
            className="cmdk__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
          >
            <input
              ref={inputRef}
              className="cmdk__input"
              placeholder="Type a command or search…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setIndex(0)
              }}
              role="combobox"
              aria-expanded="true"
              aria-controls="cmdk-list"
              aria-activedescendant={results[index] ? `cmdk-${results[index].id}` : undefined}
            />
            <ul id="cmdk-list" className="cmdk__list" role="listbox">
              {results.length === 0 && <li className="cmdk__empty">No matching commands</li>}
              {results.map((c, i) => (
                <li
                  key={c.id}
                  id={`cmdk-${c.id}`}
                  role="option"
                  aria-selected={i === index}
                  className={`cmdk__item${i === index ? ' cmdk__item--active' : ''}`}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => exec(c)}
                >
                  <span>{c.label}</span>
                  <span className="cmdk__hint">{c.hint}</span>
                </li>
              ))}
            </ul>
            <div className="cmdk__foot">↑↓ navigate · ↵ select · esc close</div>
          </div>
        </div>
      )}
    </>
  )
}

export default CommandPalette
