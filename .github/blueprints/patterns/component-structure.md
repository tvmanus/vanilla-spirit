# Component Structure Pattern

> **Scope**: Defines the canonical structure for VanillaSpirit components. All components must follow this pattern.

## Overview

Components are **functions that return a DOM element** and an **update method**. They receive initial state and a callback for dispatching actions.

---

## Component Signature

```javascript
/**
 * @param {Object} state - Current application state
 * @param {Function} onAction - Callback to dispatch state changes
 * @returns {{ element: HTMLElement, update: Function }}
 */
export function ComponentName(state, onAction) {
    // Implementation
    return { element, update };
}
```

---

## Implementation Template

Follow this exact structure for every component:

```javascript
/**
 * [ComponentName] Component
 * [Brief description of the component's purpose]
 */
export function ComponentName(state, onAction) {
    // ═══════════════════════════════════════════════════════════
    // 1. CREATE CONTAINER
    // ═══════════════════════════════════════════════════════════
    const container = document.createElement('div');
    container.setAttribute('data-component', 'component-name'); // kebab-case

    // ═══════════════════════════════════════════════════════════
    // 2. BUILD INNER HTML
    // ═══════════════════════════════════════════════════════════
    container.innerHTML = `
        <input type="text" data-ref="input" name="inputField" value="${state.value || ''}" />
        <button data-ref="action">Click Me</button>
    `;

    // ═══════════════════════════════════════════════════════════
    // 3. QUERY INTERNAL ELEMENTS
    // ═══════════════════════════════════════════════════════════
    const input = container.querySelector('[data-ref="input"]');
    const button = container.querySelector('[data-ref="action"]');

    // ═══════════════════════════════════════════════════════════
    // 4. EVENT BINDINGS
    // ═══════════════════════════════════════════════════════════
    button.addEventListener('click', () => {
        onAction({ value: input.value });
    });

    // ═══════════════════════════════════════════════════════════
    // 5. UPDATE FUNCTION (Reactivity)
    // ═══════════════════════════════════════════════════════════
    const update = (newState) => {
        // Only update if value changed (selective rendering)
        if (input.value !== newState.value) {
            input.value = newState.value;
        }
    };

    // ═══════════════════════════════════════════════════════════
    // 6. RETURN PUBLIC INTERFACE
    // ═══════════════════════════════════════════════════════════
    return { element: container, update };
}
```

---

## Rules

### 1. Container Element
- Always create a root container using `document.createElement()`.
- Set `data-component` attribute with kebab-case component name.
- The container encapsulates all component DOM.

### 2. Inner HTML
- Use template literals for multi-line HTML.
- Interpolate initial state values (escape if user-provided).
- Use `data-ref` for all elements that need JavaScript access.
- All form fields must have `name` attribute.

### 3. Element Queries
- Query elements immediately after building HTML.
- Cache all references—never query the same element twice.
- Use `container.querySelector()` (scoped to component).

### 4. Event Bindings
- Bind all events in the initialization phase.
- Use `onAction()` callback to dispatch state changes.
- Never modify state directly—always go through `onAction`.
- Include accessibility handlers (keyboard events).

### 5. Update Function
- The `update(newState)` function is called when state changes.
- Implement **selective DOM updates**—only modify what changed.
- Compare new values with current DOM values before updating.
- Never re-render the entire component in `update()`.

### 6. Return Value
- Always return `{ element, update }`.
- `element` is the root DOM node (for mounting).
- `update` is the reactivity hook (for state changes).

---

## Anti-Patterns

### ❌ Direct State Mutation
```javascript
// WRONG: Mutating state directly
button.addEventListener('click', () => {
    state.value = 'new value'; // Never do this!
});
```

### ❌ Full Re-render on Update
```javascript
// WRONG: Rebuilding entire HTML
const update = (newState) => {
    container.innerHTML = `<input value="${newState.value}" />`; // Loses event listeners!
};
```

### ❌ Using IDs or Classes for Logic
```javascript
// WRONG: Using ID for selection
document.getElementById('myButton');

// WRONG: Using class for logic
container.querySelector('.btn-submit');
```

### ❌ Missing Name on Form Fields
```javascript
// WRONG: No name attribute
<input type="text" data-ref="email" />

// CORRECT: Has name for autofill/submission
<input type="text" data-ref="email" name="userEmail" />
```

---

## Optional Extensions

### Cleanup Method
For components that need cleanup (removing event listeners, timers):

```javascript
export function ComponentName(state, onAction) {
    // ... standard setup ...
    
    const interval = setInterval(() => { /* ... */ }, 1000);
    
    const cleanup = () => {
        clearInterval(interval);
        // Remove any global event listeners
    };

    return { element: container, update, cleanup };
}
```

### Multiple Elements
If a component returns multiple top-level elements, wrap them:

```javascript
// Use DocumentFragment or a wrapper div
const fragment = document.createDocumentFragment();
fragment.appendChild(header);
fragment.appendChild(content);
return { element: fragment, update };
```

---

## Checklist

Before committing a component, verify:

- [ ] Uses `data-component` attribute on root
- [ ] Uses `data-ref` for internal element selection
- [ ] All form fields have `name` attribute
- [ ] Events dispatch via `onAction()` callback
- [ ] `update()` uses selective DOM updates
- [ ] No direct state mutation
- [ ] No ID-based or class-based selection for logic
- [ ] Includes JSDoc comment with description
