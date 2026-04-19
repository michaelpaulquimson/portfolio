# Styling Standards

## Design Tokens (src/index.css)
Always use CSS variables — never hardcode colors, spacing, or transitions:
```css
--bg-base, --bg-surface, --bg-glass
--accent-primary (#00ffff), --accent-secondary (#0080ff), --accent-glow
--text-primary, --text-secondary, --text-dim
--border-subtle, --border-accent
--font-display (Space Grotesk), --font-mono (JetBrains Mono)
--spacing-sm/md/lg/xl/2xl/3xl
--transition-fast (150ms), --transition-normal (300ms)
--radius-sm/md/lg
```

## BEM Naming
```css
.section {}           /* block */
.section__title {}    /* element */
.section--featured {} /* modifier */
```

## Rules
- Mobile-first: base styles for mobile, `@media (min-width: 768px)` for tablet+
- No hardcoded hex values in component CSS files — use tokens
- No magic numbers — use spacing tokens
- Light/dark theme: component CSS must work with both `data-theme="light"` and `data-theme="dark"`
