# State Management Pattern

> **Scope**: Defines the canonical state store implementation and usage patterns for VanillaSpirit applications.

## Overview

State management follows a **Pub/Sub (Publish/Subscribe)** model with **immutable updates**. There is a single source of truth (the store), and components subscribe to state changes.

---

## Store Interface

The store must implement exactly these three methods:

```javascript
{
    getState: () => Object,           // Returns current state
    setState: (partial) => void,      // Merges partial update into state
    subscribe: (listener) => Function // Registers listener, returns unsubscribe
}
```

---

## Store Implementation

```javascript
/**
 * Simple State Store
 * Maintains a single source of truth and notifies subscribers.
 */
export function createStore(initialState) {
    // Immutable copy of initial state
    let state = { ...initialState };
    
    // Array of subscriber callbacks
    const listeners = [];

    return {
        /**
         * Get the current state (read-only snapshot)
         */
        getState: () => state,

        /**
         * Update state with partial object (immutable merge)
         * @param {Object} newState - Partial state to merge
         */
        setState: (newState) => {
            // Immutable update: create new object
            state = { ...state, ...newState };
            
            // Notify all subscribers
            listeners.forEach(listener => listener(state));
        },

        /**
         * Subscribe to state changes
         * @param {Function} listener - Callback receiving new state
         * @returns {Function} Unsubscribe function
         */
        subscribe: (listener) => {
            listeners.push(listener);
            
            // Return unsubscribe function
            return () => {
                const index = listeners.indexOf(listener);
                if (index > -1) listeners.splice(index, 1);
            };
        }
    };
}
```

---

## Usage in main.js

### 1. Initialize Store
```javascript
import { createStore } from './core/store.js';

const store = createStore({
    text: '',
    count: 0,
    items: []
});
```

### 2. Pass to Components
```javascript
const component = MyComponent(
    store.getState(),           // Initial state
    (update) => store.setState(update)  // Update callback
);
```

### 3. Subscribe for Reactivity
```javascript
store.subscribe((newState) => {
    component.update(newState);
});
```

---

## Rules

### 1. Immutability
**Never mutate state directly.** Always create new objects/arrays.

```javascript
// ✅ Correct: Spread to create new object
setState({ count: state.count + 1 });

// ✅ Correct: Spread arrays for updates
setState({ items: [...state.items, newItem] });

// ❌ Wrong: Direct mutation
state.count++;
state.items.push(newItem);
```

### 2. Single Source of Truth
- Only one store per application.
- All components read from the same store.
- State is passed down, not shared via globals.

### 3. One-Way Data Flow
```
Store → Component (via getState/subscribe)
Component → Store (via onAction callback)
```

### 4. Shallow Merge
The `setState` performs a **shallow merge**:
```javascript
// State before: { a: 1, b: { x: 10 } }
setState({ a: 2 });
// State after: { a: 2, b: { x: 10 } }

// For nested updates, spread the nested object too:
setState({ b: { ...state.b, x: 20 } });
```

---

## Common State Patterns

### Initial State Shape
```javascript
const store = createStore({
    // UI state
    isLoading: false,
    error: null,
    
    // Data
    items: [],
    selectedId: null,
    
    // Form state
    formData: {
        name: '',
        email: ''
    }
});
```

### Array Operations
```javascript
// Add item
setState({ items: [...getState().items, newItem] });

// Remove item
setState({ items: getState().items.filter(item => item.id !== id) });

// Update item
setState({
    items: getState().items.map(item =>
        item.id === id ? { ...item, ...updates } : item
    )
});
```

### Toggle Boolean
```javascript
setState({ isOpen: !getState().isOpen });
```

---

## Component Integration Pattern

In `main.js`, wire components to the store following this exact sequence:

```javascript
import { createStore } from './core/store.js';
import { ComponentA } from './components/ComponentA.js';
import { ComponentB } from './components/ComponentB.js';

// 1. Initialize State
const store = createStore({ /* initial state */ });

// 2. Select Root
const appRoot = document.getElementById('app');

// 3. Initialize Components
const componentA = ComponentA(store.getState(), (update) => {
    store.setState(update);
});

const componentB = ComponentB(store.getState(), (update) => {
    store.setState(update);
});

// 4. Mount to DOM
appRoot.appendChild(componentA.element);
appRoot.appendChild(componentB.element);

// 5. Subscribe to Changes
store.subscribe((newState) => {
    componentA.update(newState);
    componentB.update(newState);
});
```

---

## Anti-Patterns

### ❌ Direct State Access in Components
```javascript
// WRONG: Component accessing store directly
export function BadComponent() {
    store.setState({ value: 'x' }); // Store should not be imported here
}
```

### ❌ Mutating State
```javascript
// WRONG: Mutating instead of replacing
const state = store.getState();
state.count++; // This mutates the original!
```

### ❌ Multiple Stores
```javascript
// WRONG: Creating multiple stores
const userStore = createStore({...});
const uiStore = createStore({...});
// Use one store with namespaced keys instead
```

---

## Advanced: Selective Subscriptions

For performance, you can create selector-based subscriptions:

```javascript
function subscribeToKey(store, key, callback) {
    let prevValue = store.getState()[key];
    return store.subscribe((state) => {
        if (state[key] !== prevValue) {
            prevValue = state[key];
            callback(state[key]);
        }
    });
}

// Usage
subscribeToKey(store, 'count', (count) => {
    console.log('Count changed:', count);
});
```

---

## Checklist

Before implementing state management, verify:

- [ ] Store is created once in `main.js`
- [ ] Components receive `state` and `onAction` as parameters
- [ ] Components never import the store directly
- [ ] All state updates use spread operators (immutable)
- [ ] All components subscribe to store changes
- [ ] Updates trigger selective DOM changes (not full re-renders)
