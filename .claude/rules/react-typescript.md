# React & TypeScript Standards

## Component Structure
```typescript
// 1. Imports (grouped: react → libs → local)
// 2. Interface definitions
// 3. Component (React.FC<Props>)
//    - Hooks
//    - Handlers
//    - Return JSX
// 4. Export default
```

## Rules
- Define interfaces for all props — no implicit types, no `any`
- Use `React.memo` for components rendered in lists
- Use `useCallback` for handlers passed as props
- Use `useMemo` for stable object/array references passed to hooks with dependency arrays
- Lazy-load heavy sections: `React.lazy` + `Suspense`

## Accessibility
- Semantic HTML (`<nav>`, `<main>`, `<article>`, `<button>`)
- `aria-label` on icon-only buttons and external links
- Keyboard support: `onKeyDown` for Enter/Space on interactive elements
- Modal: `role="dialog"`, `aria-modal="true"`, focus trap, Escape to close
- External links: `target="_blank" rel="noopener noreferrer"`

## Performance
- `React.memo` + `useCallback` to prevent unnecessary re-renders
- `loading="lazy"` on images below the fold
- Code-split with `React.lazy` + separate `Suspense` boundaries per section
