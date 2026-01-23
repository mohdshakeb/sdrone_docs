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

### Key Patterns

- **Styling**: CSS Modules for components, CSS variables for tokens
- **Icons**: Centralized in `Icon.tsx` using react-icons (Remixicon set)
- **Types**: `IconName` and `BadgeColor` types are exported from their components - import these when typing data
- **Theme**: `useTheme()` hook from ThemeProvider for dark/light toggle

### MDX Documentation

Documentation pages use MDX with embedded React components for interactive examples. Config in `next.config.mjs` and `mdx-components.tsx`.
