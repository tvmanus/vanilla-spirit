# VanillaSpirit Glossary

> **Scope**: Naming conventions and terminology used throughout VanillaSpirit projects.

## Terminology

| Term | Definition |
|------|------------|
| **Blueprint** | A Markdown document defining architectural rules and patterns |
| **Component** | A function that returns a DOM element and update method |
| **Store** | Central state container implementing Pub/Sub pattern |
| **State** | Immutable data object representing application data |
| **onAction** | Callback passed to components for dispatching state changes |
| **Subscriber** | Function registered to receive state change notifications |
| **Selective Update** | Updating only DOM nodes that changed, not full re-render |
| **data-ref** | Attribute for internal element selection within components |
| **data-component** | Attribute identifying component root elements |

---

## Naming Conventions

### Files

| Type | Case | Example |
|------|------|---------|
| Components | PascalCase.js | `InteractionModule.js`, `UserProfile.js` |
| Core utilities | camelCase.js | `store.js`, `eventBus.js` |
| Blueprints | kebab-case.md | `state-management.md`, `component-structure.md` |
| App blueprints | kebab-case.md | `demo-app.md`, `todo-app.md` |

### Functions

| Purpose | Prefix | Example |
|---------|--------|---------|
| Event handlers | `handle` | `handleClick`, `handleSubmit`, `handleInputChange` |
| DOM rendering | `render` | `renderList`, `renderItem`, `renderError` |
| Factory functions | `create` | `createStore`, `createElement`, `createObserver` |
| State updates | `update` | `updateDisplay`, `updateCounter` |
| Data retrieval | `get` | `getState`, `getValue`, `getSelectedItem` |
| Data setting | `set` | `setState`, `setValue` |
| Validation | `is`/`has`/`can` | `isValid`, `hasPermission`, `canSubmit` |

### Variables

| Type | Case | Example |
|------|------|---------|
| Regular variables | camelCase | `userName`, `itemCount` |
| DOM elements | camelCase | `submitButton`, `inputField`, `listContainer` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_BASE_URL` |
| Boolean flags | `is`/`has` prefix | `isLoading`, `hasError`, `isVisible` |

### Data Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-component` | Component root identifier | `data-component="user-card"` |
| `data-ref` | Internal element reference | `data-ref="submit-button"` |
| `data-id` | Bind to data model ID | `data-id="123"` |
| `data-state` | Reflect component state | `data-state="loading"` |
| `data-action` | Identify action trigger | `data-action="delete"` |

### Events

| Type | Pattern | Example |
|------|---------|---------|
| Custom events | `app:action-name` | `app:user-logged-in`, `app:notification` |
| Component events | `component:action` | `modal:opened`, `form:submitted` |

---

## Code Patterns Quick Reference

### Component Creation
```javascript
export function ComponentName(state, onAction) { ... }
```

### Store Creation
```javascript
const store = createStore({ initialValue: '' });
```

### Element Selection
```javascript
container.querySelector('[data-ref="element-name"]');
```

### State Update
```javascript
onAction({ key: newValue });
```

### Subscription
```javascript
store.subscribe((newState) => component.update(newState));
```

---

## Forbidden Patterns

| ❌ Don't | ✅ Do Instead |
|----------|---------------|
| `var x = 1` | `const x = 1` or `let x = 1` |
| `document.getElementById('x')` | `container.querySelector('[data-ref="x"]')` |
| `state.value = x` (mutation) | `onAction({ value: x })` |
| `export default function()` | `export function ComponentName()` |
| Global variables | Module-scoped variables |
| `<input>` without name | `<input name="fieldName">` |
