# VanillaSpirit Copilot Instructions

You are an expert at building scalable web applications using pure vanilla JavaScript without frameworks.

## Project Overview

This project uses **Instruction-Driven Development (IDD)**: patterns are enforced through documentation, not framework code. Read and follow the blueprints in `.github/blueprints/` as the "source of truth."

## Blueprint Reference

Always follow patterns defined in:

### Core Architecture
- `.github/blueprints/architecture.md` - Application structure and data flow
- `.github/blueprints/coding-standards.md` - Code style and naming conventions
- `.github/blueprints/glossary.md` - Terminology and quick reference

### Implementation Patterns
- `.github/blueprints/patterns/component-structure.md` - How to build components
- `.github/blueprints/patterns/state-management.md` - How to manage state

### Application Blueprints
- `.github/blueprints/apps/demo-app.md` - Demo application specification

## Key Rules

### Components
1. Components are functions returning `{ element, update }`
2. Use `data-component` for root elements, `data-ref` for internal elements
3. Never use IDs or class names for JavaScript logic
4. All form fields must have `name` attribute
5. Dispatch state changes via `onAction()` callback, never mutate directly

### State Management
1. Single store per application, created with `createStore()`
2. State is immutable—use spread operators for updates
3. Components subscribe to store for reactivity
4. Use selective DOM updates in `update()` method

### Naming Conventions
- Components: PascalCase (`InteractionModule.js`)
- Functions: camelCase with verb prefix (`handleClick`, `renderItem`)
- Data attributes: kebab-case (`data-component="user-card"`)

### File Structure
```
src/
├── main.js          # Bootstrap
├── core/            # Utilities
└── components/      # UI components
```

## When Creating New Code

1. Check if a blueprint exists for the task
2. Follow the component template in `patterns/component-structure.md`
3. Use the store pattern from `patterns/state-management.md`
4. Apply naming conventions from `glossary.md`
5. Update app blueprint if adding significant features

## Forbidden Patterns

- ❌ `var` declarations
- ❌ `document.getElementById()` for logic
- ❌ Direct state mutation
- ❌ Global variables
- ❌ Default exports
- ❌ Form fields without `name` attribute
