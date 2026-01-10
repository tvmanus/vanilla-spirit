# VanillaSpirit Architecture Blueprint

> **Scope**: This document defines the foundational architectural principles for all VanillaSpirit applications. It is the "law" that all coding agents and developers must follow.

## 1. Core Philosophy

VanillaSpirit uses **Instruction-Driven Development (IDD)**: patterns are enforced through documentation, not framework code. The result is zero-dependency vanilla JavaScript that any AI agent can understand and implement.

### Guiding Principles
- **Zero Framework Dependency**: Ship only vanilla JS—no React, Vue, or Angular.
- **Explicit Over Magic**: All behavior must be traceable in code; no hidden abstractions.
- **AI Portability**: All patterns must be describable in plain Markdown for LLM consumption.

---

## 2. Application Structure

Every VanillaSpirit application follows this directory structure:

```
project-root/
├── index.html              # Entry point (minimal HTML shell)
├── src/
│   ├── main.js             # Application bootstrap
│   ├── core/               # Shared utilities and state management
│   │   └── store.js        # Central state store
│   └── components/         # UI components
│       └── [ComponentName].js
├── .github/
│   ├── blueprints/         # Architectural rules (this directory)
│   └── copilot-instructions.md
└── references/             # Proven code examples (templates only)
```

---

## 3. The Application Lifecycle

### 3.1 Bootstrap Sequence

Every application follows this exact initialization order in `main.js`:

```
1. Import dependencies (store, components)
2. Initialize the state store with default state
3. Select the application root element
4. Create component instances, passing state and update callback
5. Mount components to the DOM
6. Subscribe components to state changes for reactivity
```

### 3.2 Data Flow Model

```
┌─────────────────────────────────────────────────────────┐
│                     STATE STORE                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │  getState() │    │  setState() │    │ subscribe() │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
└─────────────────────────────────────────────────────────┘
         │                   ▲                   │
         │                   │                   │
         ▼                   │                   ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   Component A   │   │   User Action   │   │  State Change   │
│   (init with    │──▶│   (callback)    │   │  Notification   │
│    state)       │   └─────────────────┘   └────────┬────────┘
└─────────────────┘                                  │
         ▲                                           │
         │                                           │
         └───────────────────────────────────────────┘
                    Component.update(newState)
```

**Rules**:
- State flows **down** from store to components.
- Actions flow **up** via callbacks passed to components.
- Components never directly mutate state—only request changes via callbacks.

---

## 4. HTML Entry Point Rules

The `index.html` file must be minimal:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Application Title]</title>
    <!-- Optional: favicon, meta tags -->
</head>
<body>
    <div id="app"></div>
    <script type="module" src="./src/main.js"></script>
</body>
</html>
```

**Rules**:
- Use `id="app"` for the root mount point.
- Always use `type="module"` for ES6 module support.
- No inline scripts or styles.
- All logic lives in JavaScript modules.

---

## 5. Module System

- **ES6 Modules Only**: Use `import`/`export` syntax.
- **No Global Variables**: All state and functions must be module-scoped.
- **Named Exports**: Prefer named exports over default exports for clarity.

```javascript
// ✅ Correct
export function MyComponent(state, onAction) { ... }
export function createStore(initialState) { ... }

// ❌ Avoid
export default function() { ... }
```

---

## 6. Cross-Component Communication

For communication between unrelated components, use `CustomEvent`:

```javascript
// Dispatch
window.dispatchEvent(new CustomEvent('app:notification', {
    detail: { message: 'Hello' }
}));

// Listen
window.addEventListener('app:notification', (e) => {
    console.log(e.detail.message);
});
```

**Naming Convention**: Use `app:` prefix for application-level events.

---

## 7. File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `InteractionModule.js` |
| Core utilities | camelCase | `store.js`, `utils.js` |
| Blueprints | kebab-case | `state-management.md` |
| App blueprints | kebab-case | `demo-app.md` |

---

## References

- See `patterns/component-structure.md` for component implementation details.
- See `patterns/state-management.md` for store implementation details.
- See `apps/` directory for application-specific blueprints.
