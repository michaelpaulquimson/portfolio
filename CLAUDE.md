# Frontend Development Best Practices

This document outlines the coding standards and best practices for this React/TypeScript frontend project.

## 🎯 Core Principles

1. **Type Safety First**: Leverage TypeScript for robust, maintainable code
2. **Component Composition**: Build reusable, composable components
3. **Accessibility**: Ensure WCAG 2.1 AA compliance
4. **Performance**: Optimize for fast load times and smooth interactions
5. **Maintainability**: Write clean, self-documenting code

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
├── contexts/         # React Context providers
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── constants/        # Application constants
└── assets/           # Static assets (images, fonts, etc.)
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `ProjectCard.tsx`)
- **Styles**: Match component name (e.g., `ProjectCard.css`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useProjects.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `Project.ts`)

---

## 🔧 React/TypeScript Standards

### Component Structure

```typescript
// 1. Imports - grouped and ordered
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'

// 2. Type definitions
interface ProjectCardProps {
  project: Project
  onClick: (project: Project) => void
}

// 3. Component definition with explicit return type
const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  // 4. Hooks (useState, useEffect, custom hooks)
  const [isHovered, setIsHovered] = useState(false)

  // 5. Event handlers
  const handleClick = () => {
    onClick(project)
  }

  // 6. Render
  return (
    <div>{/* JSX */}</div>
  )
}

// 7. Export
export default ProjectCard
```

### TypeScript Best Practices

#### ✅ DO:
```typescript
// Define interfaces for all props
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

// Use React.FC for functional components
const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary', disabled = false }) => {
  return <button onClick={onClick}>{label}</button>
}

// Define types for complex data structures
interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  category: 'web' | 'mobile' | 'fullstack' | 'tool'
}

// Use enums for fixed sets of values
enum ProjectCategory {
  WEB = 'web',
  MOBILE = 'mobile',
  FULLSTACK = 'fullstack',
  TOOL = 'tool'
}
```

#### ❌ DON'T:
```typescript
// Don't use 'any'
const data: any = fetchData() // BAD

// Don't skip prop types
const Button = ({ label, onClick }) => { } // BAD

// Don't use implicit types when they're not obvious
const items = [] // BAD - what type are the items?
```

---

## 🎨 Styling Standards

### CSS Best Practices

#### 1. Use CSS Custom Properties (Variables)
```css
:root {
  /* Color System */
  --color-primary: #d4af37;
  --color-secondary: #1b4332;
  --color-text-primary: #2d2d2d;

  /* Spacing System */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-heading: 'Playfair Display', serif;
  --font-body: 'IBM Plex Sans', sans-serif;

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

#### 2. BEM Naming Convention (or Component-Scoped)
```css
/* Component-scoped naming */
.project-card {
  /* Card container */
}

.project-card__header {
  /* Child element */
}

.project-card__title {
  /* Child element */
}

.project-card--featured {
  /* Modifier */
}
```

#### 3. Mobile-First Responsive Design
```css
/* Base styles (mobile) */
.container {
  padding: 1rem;
  font-size: 0.875rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    font-size: 1rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    font-size: 1.125rem;
  }
}
```

#### 4. Avoid Magic Numbers
```css
/* ❌ BAD */
.button {
  padding: 12px 24px;
  margin-top: 16px;
}

/* ✅ GOOD */
.button {
  padding: var(--spacing-md) var(--spacing-lg);
  margin-top: var(--spacing-lg);
}
```

---

## ♿ Accessibility (a11y)

### Essential Requirements

#### 1. Semantic HTML
```tsx
// ✅ GOOD
<nav>
  <button onClick={handleClick}>Menu</button>
</nav>

<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>

// ❌ BAD
<div>
  <div onClick={handleClick}>Menu</div>
</div>
```

#### 2. ARIA Labels
```tsx
// Interactive elements without visible text
<button
  onClick={handleClose}
  aria-label="Close modal"
>
  ×
</button>

// Links that open in new windows
<a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`${title} (opens in new window)`}
>
  View Project
</a>

// Icon-only buttons
<button
  onClick={toggleTheme}
  aria-label="Toggle dark mode"
>
  <MoonIcon />
</button>
```

#### 3. Keyboard Navigation
```tsx
// All interactive elements must be keyboard accessible
const Modal: React.FC<ModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {/* Modal content */}
    </div>
  )
}
```

#### 4. Color Contrast
- Ensure text has sufficient contrast ratio (4.5:1 for normal text, 3:1 for large text)
- Don't rely solely on color to convey information
- Test with tools like Chrome DevTools Lighthouse

#### 5. Focus Management
```tsx
// Trap focus within modals
const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
    >
      {/* Content */}
    </div>
  )
}
```

---

## ⚡ Performance Best Practices

### 1. Code Splitting
```tsx
// Lazy load components
import React, { lazy, Suspense } from 'react'

const Projects = lazy(() => import('./components/Projects'))
const APITester = lazy(() => import('./components/APITester'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Projects />
      <APITester />
    </Suspense>
  )
}
```

### 2. Memoization
```tsx
// Memoize expensive computations
const ExpensiveComponent: React.FC<Props> = ({ data }) => {
  const processedData = useMemo(() => {
    return expensiveOperation(data)
  }, [data])

  return <div>{processedData}</div>
}

// Memoize callbacks
const Parent: React.FC = () => {
  const handleClick = useCallback((id: number) => {
    console.log(id)
  }, [])

  return <Child onClick={handleClick} />
}
```

### 3. Optimize Images
- Use appropriate image formats (WebP, AVIF)
- Implement lazy loading for images
- Use responsive images with srcset
- Compress images before deployment

### 4. Avoid Unnecessary Re-renders
```tsx
// Use React.memo for pure components
const ProjectCard = React.memo<ProjectCardProps>(({ project }) => {
  return <div>{project.title}</div>
})

// Use stable object references
const Parent: React.FC = () => {
  const config = useMemo(() => ({
    theme: 'dark',
    layout: 'grid'
  }), [])

  return <Child config={config} />
}
```

---

## 🔐 Security Best Practices

### 1. XSS Prevention
```tsx
// ✅ GOOD - React escapes by default
<div>{userInput}</div>

// ⚠️ Avoid innerHTML manipulation - use React's built-in escaping
// If HTML rendering is absolutely necessary, sanitize with DOMPurify first
```

### 2. Secure External Links
```tsx
// Always use rel="noopener noreferrer" for target="_blank"
<a
  href={externalUrl}
  target="_blank"
  rel="noopener noreferrer"
>
  External Link
</a>
```

### 3. Environment Variables
```typescript
// Never commit secrets
// Use environment variables for sensitive data
const API_KEY = import.meta.env.VITE_API_KEY

// Never expose sensitive keys in client-side code
```

---

## 📝 Code Quality

### ESLint Rules (Recommended)
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Code Review Checklist

- [ ] TypeScript types are defined for all components and functions
- [ ] No use of `any` type
- [ ] Components are properly memoized if needed
- [ ] Accessibility attributes are present (aria-labels, roles, etc.)
- [ ] Semantic HTML is used
- [ ] CSS follows naming conventions
- [ ] No hardcoded values (use constants/variables)
- [ ] Error boundaries are in place
- [ ] Loading states are handled
- [ ] Empty states are handled
- [ ] External links use rel="noopener noreferrer"
- [ ] Images have alt text
- [ ] Forms have proper labels
- [ ] Code is formatted consistently
- [ ] No commented-out code
- [ ] Console logs are removed

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Lighthouse score > 90 for all categories
- [ ] Cross-browser testing complete
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit passed
- [ ] Images optimized
- [ ] Bundle size is reasonable
- [ ] Environment variables configured
- [ ] Meta tags and SEO optimized

### Post-Deployment
- [ ] Monitor error tracking (Sentry, etc.)
- [ ] Check analytics setup
- [ ] Verify all links work
- [ ] Test forms and interactive elements
- [ ] Check SSL certificate

---

## 📚 Additional Resources

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [CSS Guidelines](https://cssguidelin.es/)
- [JavaScript Clean Code](https://github.com/ryanmcdermott/clean-code-javascript)

---

## 🔄 Continuous Improvement

This document should be updated as new patterns emerge and best practices evolve. All team members are encouraged to contribute improvements.

**Last Updated**: January 2026
