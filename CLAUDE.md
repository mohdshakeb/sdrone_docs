# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **design system documentation and prototype handoff site** for the S-Drone safety/incident management application. It serves two purposes:
1. Document design tokens, components, and patterns for developer handoff
2. Provide a working prototype demonstrating component usage in context

**This is NOT a production app** - no database, auth, or real functionality. Focus on design accuracy and demo quality.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint (currently has config issue)
npx tsc --noEmit # Type check
```

## Architecture

### Two Route Groups

- **`/app/(docs)/`** - Design system documentation site using MDX
  - Landing page at `/`
  - Documentation pages at `/docs/colors`, `/docs/buttons`, etc.
  - Uses `components/docs/` for Sidebar, Header, showcases

- **`/app/sdrone/`** - S-Drone prototype application
  - Inbox, History, Alerts, Insights, Settings pages
  - Uses `components/prototype/` for AppSidebar, AppHeader, TaskCard, EmptyState

### Component Organization

```
components/
├── ui/           # Core design system (Button, Badge, FilterChip, Icon, ThemeProvider)
├── docs/         # Documentation-specific (Sidebar, Header, showcases)
├── prototype/    # S-Drone app-specific (AppSidebar, AppHeader, TaskCard)
```

### Design Token System

All tokens defined in `app/globals.css`:
- **Primitive tokens**: `--color-*`, `--space-*` (raw values)
- **Semantic tokens**: `--bg-*`, `--fg-*`, `--border-*` (usage-based)
- **Dark mode**: Uses `[data-theme='dark']` selector, managed by `ThemeProvider`

Typography uses utility classes: `.text-heading`, `.text-body-strong`, `.text-body`, `.text-caption-strong`, `.text-caption`, `.text-caption-small`

#### IMPORTANT: Docs vs App Styling Separation

**The documentation site and the S-Drone prototype app now have SEPARATE styling systems:**

- **Documentation site (`/app/(docs)/`)**: Has its own styling separate from the main token system
  - Documentation pages may use different styling approaches
  - Docs-specific components in `components/docs/` can use independent styles

- **S-Drone prototype app (`/app/sdrone/`)**: Uses the main design token system
  - Follows the semantic token structure (`--bg-*`, `--fg-*`, etc.)
  - All prototype components must use tokens from `app/globals.css`
  - This is the "source of truth" for the design system being documented

**When working on components:**
- `components/ui/` - Core design system components MUST use main token system
- `components/prototype/` - App components MUST use main token system
- `components/docs/` - Documentation components may use separate styling

This separation allows the documentation site to have its own visual identity while the prototype demonstrates the actual design system.

### Key Patterns

- **Styling**: CSS Modules for components, CSS variables for tokens
- **Icons**: Centralized in `Icon.tsx` using react-icons (Remixicon set)
- **Types**: `IconName` and `BadgeColor` types are exported from their components - import these when typing data
- **Theme**: `useTheme()` hook from ThemeProvider for dark/light toggle

### MDX Documentation

Documentation pages use MDX with embedded React components for interactive examples. Config in `next.config.mjs` and `mdx-components.tsx`.

---

## Design Principles

- **Visual Hierarchy**: Use established text styles, spacing scale must follow 4px grid
- **Color Usage**: Always use semantic tokens (--bg-*, --fg-*), never primitive tokens directly in components
- **Accessibility**: Minimum WCAG AA contrast ratios, keyboard navigation required for all interactive elements
- **Responsive**: Mobile-first approach, breakpoints at 640px, 768px, 1024px
- **Consistency**: Follow existing patterns for similar features

---

## Critical Constraints

### ❌ DO NOT

- Implement backend functionality (auth, database, API calls, real data fetching)
- Add new color or typography tokens without EXPLICITLY asking the developer first
- Use hardcoded colors or inline styles - always use CSS variables from globals.css
- Use primitive tokens (--color-*) directly in components - use semantic tokens (--bg-*, --fg-*)
- Add new dependencies without confirming with the developer
- Create duplicate components - check existing components first
- Break dark mode - every color change must have both light and dark variants
- Modify the design token structure without consultation

### ✅ ALWAYS DO

- Ensure all prototype interactions are client-side only with mocked data
- Maintain consistency with existing component patterns
- Use existing Icon names - check `Icon.tsx` for available icons before requesting new ones
- Follow Next.js 14+ App Router best practices
- Use TypeScript strict mode - proper types for all props and data
- Implement proper keyboard navigation and ARIA attributes
- Test in both light and dark modes before completing
- Use CSS Modules for component-specific styles
- Follow the established file naming convention

---

## Design Token Management

### IMPORTANT: Token Addition Policy

**Before adding ANY new color or typography token:**
1. Check if an existing token can be used
2. If new token is truly needed, STOP and ASK the developer:
   - "I need to add a new [color/typography] token for [specific use case]"
   - "Proposed token name: --[token-name]"
   - "Should I proceed or use an existing token instead?"
3. Wait for confirmation before proceeding

### When Adding Approved Tokens

If developer approves a new token:
1. Add to `app/globals.css` under the appropriate section
2. Add corresponding dark mode variant in `[data-theme='dark']` block
3. Use descriptive semantic names (e.g., `--bg-error`, not `--red-light`)
4. Document the new token in the relevant `/docs` page
5. Ensure consistent naming with existing tokens

### Token Naming Convention

The design system follows industry-standard naming patterns (Material Design 3, Radix UI, Tailwind) with clear hierarchies:

**Background Tokens:**
- `--bg-canvas` - Main page background
- `--bg-base` - Base layer backgrounds
- `--bg-surface` - Surface elements (cards, panels)
- `--bg-subtle` - Subtle backgrounds
- `--bg-emphasis` - Emphasized/contrasting backgrounds
- `--bg-hover` - Hover state backgrounds
- `--bg-accent` - Primary accent color
- `--bg-accent-soft` - Light accent backgrounds
- `--bg-accent-hover` - Accent hover state

**Foreground/Text Tokens:**
- `--fg-default` - Primary text color (most content)
- `--fg-secondary` - Secondary text color
- `--fg-subtle` - Subtle text (de-emphasized content)
- `--fg-muted` - Muted text (disabled, placeholders)
- `--fg-accent` - Accent color text
- `--fg-accent-emphasis` - High-emphasis accent text
- `--fg-accent-soft` - Soft accent text
- `--fg-on-accent` - Text on accent backgrounds

**Border Tokens:**
- `--border-default` - Standard borders
- `--border-subtle` - Subtle borders/dividers
- `--border-emphasis` - Strong/emphasized borders

**Status Tokens** (for information, negative, neutral, notice, positive, primary):
- `--bg-{status}-soft` - Light backgrounds for status (light bg, dark text)
- `--fg-{status}-soft` - Text for soft status backgrounds
- `--bg-{status}-solid` - Solid backgrounds for status (dark bg, light text)
- `--fg-{status}-solid` - Text for solid status backgrounds

**Naming Principles:**
- Hierarchy: `muted < subtle < default < emphasis` (consistent across all types)
- Purpose-based names describe visual weight, not lightness/darkness
- Status clarity: `-soft` (light emphasis) and `-solid` (strong emphasis)
- Consistent patterns across light and dark themes

---

## Component Development Guidelines

### Adding New Components

When creating new components:
1. **Determine location:**
   - `components/ui/` - Reusable design system components
   - `components/prototype/` - S-Drone app-specific components
   - `components/docs/` - Documentation site-specific components

2. **File structure:**
   - Component: `ComponentName.tsx`
   - Styles: `ComponentName.module.css`
   - Follow existing patterns for exports and prop types

3. **Component checklist:**
   - Export TypeScript interface for props
   - Use CSS Modules for styling
   - Reference CSS variables from globals.css
   - Add proper TypeScript types (no `any`)
   - Include JSDoc comments for complex props
   - Support dark mode via CSS variables
   - Add to barrel export (`components/ui/index.ts`) if appropriate

4. **Styling rules:**
   - Use semantic tokens, never primitive tokens
   - Follow existing spacing patterns (4px grid)
   - Use utility classes for typography
   - Mobile-first responsive design
   - Hover, focus, and active states required

### Adding New Pages

**Documentation page (`app/(docs)/docs/[name]/page.mdx`):**
1. Create MDX file with frontmatter
2. Update `components/docs/Sidebar.tsx` navigation
3. Use MDX components for interactive examples
4. Follow existing documentation structure

**Prototype page (`app/sdrone/[name]/page.tsx`):**
1. Create page component
2. Use AppSidebar and AppHeader in layout
3. Import components from `components/prototype/`
4. Use hardcoded/mocked data only
5. Ensure responsive layout

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/globals.css` | All design tokens, utility classes, global styles |
| `components/ui/Icon.tsx` | Available icon names (IconName type export) |
| `components/ui/Badge.tsx` | Badge color variants (BadgeColor type export) |
| `components/ui/ThemeProvider.tsx` | Theme context and dark mode logic |
| `mdx-components.tsx` | Custom MDX component mappings for docs |
| `app/(docs)/layout.tsx` | Documentation site layout wrapper |
| `app/sdrone/layout.tsx` | Prototype app layout wrapper |
| `next.config.mjs` | Next.js and MDX configuration |

---

## Best Practices

### Next.js 14+ App Router
- Use Server Components by default
- Add `'use client'` only when needed (state, effects, browser APIs)
- Leverage automatic code splitting
- Use proper metadata exports for SEO
- Follow file-based routing conventions

### React Best Practices
- Functional components with TypeScript
- Use hooks appropriately (no conditional hooks)
- Proper dependency arrays in useEffect
- Memoize expensive computations with useMemo
- Use useCallback for event handlers passed to children

### TypeScript Best Practices
- Strict mode enabled - no implicit any
- Export interfaces for all component props
- Use proper typing for event handlers
- Avoid type assertions unless absolutely necessary
- Use discriminated unions for variants

### CSS Best Practices
- CSS Modules for component isolation
- CSS variables for theming
- Mobile-first media queries
- BEM-like naming within modules
- Avoid !important (use specificity instead)
- Use logical properties (margin-inline, padding-block)

### Accessibility Best Practices
- Semantic HTML elements
- Proper heading hierarchy
- ARIA attributes where needed
- Keyboard navigation support
- Focus visible indicators
- Alt text for images
- Color contrast WCAG AA minimum

---

## Quality Checklist

Before marking any task as complete:
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Follows existing code patterns and conventions
- [ ] Uses semantic tokens, no hardcoded colors
- [ ] Dark mode tested and working correctly
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1024px+)
- [ ] Interactive elements have hover/focus/active states
- [ ] Keyboard navigation works properly
- [ ] No console errors or warnings
- [ ] Follows accessibility guidelines
- [ ] Code is properly typed (no `any` types)
- [ ] CSS follows BEM-like naming in modules
- [ ] No new tokens added without developer approval

---

## Common Development Tasks

### Task: Add a new documentation page
```bash
# 1. Create the MDX file
app/(docs)/docs/new-feature/page.mdx

# 2. Add frontmatter and content
# 3. Update Sidebar.tsx with new navigation item
# 4. Test navigation and responsive layout
```

### Task: Create a new UI component
```bash
# 1. Create component files
components/ui/NewComponent.tsx
components/ui/NewComponent.module.css

# 2. Export from barrel file
# components/ui/index.ts

# 3. Create documentation page showing usage
# 4. Test in both themes
```

### Task: Add a prototype feature
```bash
# 1. Create page or update existing
app/sdrone/feature/page.tsx

# 2. Create necessary components in components/prototype/
# 3. Use mocked data
# 4. Ensure consistent with app design patterns
```

---

## Known Issues

- ESLint config has issues - use TypeScript compiler (`npx tsc --noEmit`) for validation instead
- Lint command may fail - prioritize TypeScript type checking

---

## When Unsure

If you encounter any of these situations, STOP and ASK:
1. Need to add a new color or typography token
2. Unsure which existing token to use
3. Need to install a new npm package
4. Design pattern doesn't match existing code
5. Breaking change to component API
6. Accessibility concern with proposed solution
7. Performance concern with implementation
8. Need to modify build configuration

**Always prefer asking over guessing when it comes to design system decisions.**

---

## Maintaining CLAUDE.md

**IMPORTANT: Always ask to update this file when making significant architectural changes or decisions.**

After completing any of the following, ask the developer if CLAUDE.md should be updated:
- Architectural changes (routing, styling, component organization)
- New design patterns or conventions established
- Changes to the token system or styling approach
- New development workflows or commands
- Updates to build configuration or tooling
- New component categories or organizational structures
- Changes to documentation site vs. prototype app separation
- Important decisions about how things should be done going forward

**Ask:** "Should I update CLAUDE.md to document [the change/decision]?"

Keeping this file accurate ensures consistent development patterns and helps future Claude sessions understand the project correctly.