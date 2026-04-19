# Portfolio – Claude Code Instructions

## Stack
React 19, TypeScript 5.8, Vite 7, Framer Motion 12, GSAP 3, CSS custom properties

## Project Structure
```
src/
├── components/     # UI components (PascalCase + matching .css)
├── constants/      # App data (projects.ts, designTokens.ts)
├── contexts/       # React context providers
├── hooks/          # Custom hooks (use* prefix)
├── types/          # TypeScript interfaces
└── assets/
public/images/      # Project screenshots and assets
```

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Type check: `npx tsc --noEmit`

## Key Conventions
- Components: `React.FC<Props>` with explicit interface, `React.memo` for list items
- CSS: BEM naming (`.block__element--modifier`), CSS custom properties only — no hardcoded colors or magic numbers
- Design tokens: all colors, spacing, transitions use `var(--*)` from `src/index.css`
- No `any` types
- `e.stopPropagation()` on links inside clickable cards
- Modal centering: use flexbox wrapper — never `transform: translate(-50%, -50%)` (breaks Framer Motion)
- `sectionRefs` must be wrapped in `useMemo` to prevent infinite re-renders in `useScrollSection`

## Theme
Dual light/dark via `data-theme` attribute on `<html>`. Default: light. All component CSS must use CSS variables — no hardcoded hex values.

## Detailed Rules
@.claude/rules/react-typescript.md
@.claude/rules/styling.md
@.claude/rules/ai-guidelines.md
