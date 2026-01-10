# VanillaSpirit Coding Standards

> **Scope**: This document defines the coding style, naming conventions, and best practices for all VanillaSpirit code.

## 1. JavaScript Standards

### 1.1 Language Features
- Use **ES6+** features: `const`/`let`, arrow functions, template literals, destructuring.
- Prefer `const` over `let`; never use `var`.
- Use template literals for string interpolation and multi-line strings.

### 1.2 Functions
- Use **named function declarations** for exported functions (better stack traces).
- Use **arrow functions** for callbacks and inline functions.

```javascript
// ✅ Exported function
export function InteractionModule(state, onAction) {
    // ...
}

// ✅ Callback
button.addEventListener('click', () => handleClick());

// ❌ Avoid anonymous exports
export default function(state) { ... }
```

### 1.3 Variable Naming

| Type | Convention | Example |
|------|------------|---------|
| Functions | camelCase, verb prefix | `handleClick`, `renderList` |
| Components | PascalCase | `InteractionModule` |
| DOM elements | camelCase, descriptive | `submitButton`, `inputField` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |
| Boolean | `is`/`has`/`can` prefix | `isLoading`, `hasError` |

### 1.4 Function Naming Prefixes

| Prefix | Purpose | Example |
|--------|---------|---------|
| `handle` | Event handlers | `handleButtonClick` |
| `render` | DOM-modifying functions | `renderTextField` |
| `create` | Factory functions | `createStore` |
| `update` | State/DOM update functions | `updateDisplay` |
| `get` | Data retrieval | `getState` |
| `set` | Data mutation | `setState` |

---

## 2. DOM Interaction Standards

### 2.1 Element Selection
- **ALWAYS** use `data-*` attributes for JavaScript selection.
- **NEVER** use IDs or class names for logic (reserve for CSS styling).

```javascript
// ✅ Correct
container.querySelector('[data-ref="trigger"]');
container.querySelector('[data-component="user-card"]');

// ❌ Avoid
document.getElementById('myButton');
document.querySelector('.btn-primary');
```

### 2.2 Data Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-component` | Identify component root | `data-component="interaction-module"` |
| `data-ref` | Reference internal elements | `data-ref="trigger"` |
| `data-id` | Bind to data model | `data-id="${item.id}"` |
| `data-state` | Reflect component state | `data-state="loading"` |

### 2.3 Element Creation
- Use `document.createElement()` for component containers.
- Use `innerHTML` with template literals for complex structures.
- Always escape user-provided data to prevent XSS.

```javascript
const container = document.createElement('div');
container.setAttribute('data-component', 'my-component');
container.innerHTML = `
    <input type="text" data-ref="input" name="fieldName" />
    <button data-ref="submit">Submit</button>
`;
```

---

## 3. Form Field Standards

### 3.1 Required Attributes
Every form field **MUST** have:
- A unique `name` attribute (for form submission and autofill).
- A descriptive `name` based on data purpose.

```javascript
// ✅ Correct
<input type="text" data-ref="display" name="displayText" value="" />
<input type="email" data-ref="email" name="userEmail" />

// ❌ Missing name
<input type="text" data-ref="display" value="" />
```

### 3.2 Accessibility
- Use `<label>` elements with `for` attribute matching input `id`.
- Include `aria-*` attributes where appropriate.
- Ensure keyboard navigation works (test with Tab key).

---

## 4. Event Handling Standards

### 4.1 Binding Events
- Bind events in the component's initialization phase.
- Use named handler references when logic is complex.
- Always clean up event listeners if component is removed.

```javascript
// ✅ Inline for simple actions
button.addEventListener('click', () => onAction({ clicked: true }));

// ✅ Named handler for complex logic
const handleSubmit = (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (value) onAction({ submitted: value });
};
form.addEventListener('submit', handleSubmit);
```

### 4.2 Event Delegation
For lists or dynamic content, use event delegation:

```javascript
list.addEventListener('click', (e) => {
    const item = e.target.closest('[data-ref="list-item"]');
    if (item) {
        const id = item.getAttribute('data-id');
        onAction({ selectedId: id });
    }
});
```

---

## 5. Comments and Documentation

### 5.1 JSDoc for Exported Functions
```javascript
/**
 * InteractionModule Component
 * Contains a text field and a button for user interaction.
 * @param {Object} state - Current application state
 * @param {Function} onAction - Callback to dispatch state changes
 * @returns {{ element: HTMLElement, update: Function }}
 */
export function InteractionModule(state, onAction) {
    // ...
}
```

### 5.2 Inline Comments
- Explain **why**, not **what**.
- Mark sections with clear headers.

```javascript
// Event Bindings
button.addEventListener('mousedown', () => onAction({ text: 'Click!' }));

// Accessibility: handle keyboard navigation
button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onAction({ text: 'Click!' });
});
```

---

## 6. Code Organization

### 6.1 Component File Structure
```javascript
/**
 * [Component Name] Component
 * [Brief description]
 */
export function ComponentName(state, onAction) {
    // 1. Create container
    const container = document.createElement('div');
    container.setAttribute('data-component', 'component-name');
    
    // 2. Build inner HTML
    container.innerHTML = `...`;

    // 3. Query internal elements
    const element1 = container.querySelector('[data-ref="element1"]');

    // 4. Event bindings
    element1.addEventListener('click', () => { ... });

    // 5. Update function
    const update = (newState) => {
        // Selective DOM updates
    };

    // 6. Return public interface
    return { element: container, update };
}
```

### 6.2 Import Order
```javascript
// 1. Core utilities
import { createStore } from './core/store.js';

// 2. Components (alphabetical)
import { ComponentA } from './components/ComponentA.js';
import { ComponentB } from './components/ComponentB.js';

// 3. Local modules
import { helpers } from './utils.js';
```

---

## 7. Performance Guidelines

- **Minimize DOM reads**: Cache element references.
- **Batch DOM writes**: Make multiple changes, then append once.
- **Selective updates**: Only update DOM nodes that changed.
- **Avoid layout thrashing**: Read all values before writing.

```javascript
// ✅ Selective update
const update = (newState) => {
    if (input.value !== newState.text) {
        input.value = newState.text;
    }
};

// ❌ Full re-render
const update = (newState) => {
    container.innerHTML = `<input value="${newState.text}" />`;
};
```
