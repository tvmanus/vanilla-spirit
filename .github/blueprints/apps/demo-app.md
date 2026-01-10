# Demo App Blueprint

> **Scope**: Complete specification for the VanillaSpirit Demo Application. An AI agent should be able to reproduce `index.html` and `main.js` using only this blueprint and the resources in `src/components/` and `src/core/`.

## Overview

The Demo App is a minimal interactive application demonstrating the VanillaSpirit patterns:
- State management with Pub/Sub store
- Component-based architecture
- Reactive DOM updates

**User Interaction**: A button labeled "Hold Me" that updates a text field when pressed.

---

## Application Structure

```
project-root/
├── index.html                          # HTML entry point
├── src/
│   ├── main.js                         # Application bootstrap
│   ├── core/
│   │   └── store.js                    # State store (PROVIDED)
│   └── components/
│       └── InteractionModule.js        # UI component (PROVIDED)
```

---

## File Specifications

### 1. index.html

**Purpose**: Minimal HTML shell that loads the application.

**Requirements**:
- DOCTYPE html5
- Language: English (`lang="en"`)
- Meta charset: UTF-8
- Meta viewport for responsive design
- Title: "Vanilla Spirit Explorer"
- Optional: favicon link (`favicon.svg`, type `image/svg+xml`)
- Body contains single `<div id="app"></div>` mount point
- Script tag loading `./src/main.js` with `type="module"`

**Template**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vanilla Spirit Explorer</title>
    <link rel="icon" href="favicon.svg" type="image/svg+xml">
</head>
<body>
    <div id="app"></div>
    <script type="module" src="./src/main.js"></script>
</body>
</html>
```

---

### 2. src/main.js

**Purpose**: Application entry point that wires together state and components.

**Dependencies** (import from provided resources):
- `createStore` from `./core/store.js`
- `InteractionModule` from `./components/InteractionModule.js`

**Initial State**:
```javascript
{ text: '' }
```

**Bootstrap Sequence** (must follow this exact order):

1. **Import dependencies**
   ```javascript
   import { createStore } from './core/store.js';
   import { InteractionModule } from './components/InteractionModule.js';
   ```

2. **Initialize State Store**
   ```javascript
   const store = createStore({ text: '' });
   ```

3. **Select Application Root**
   ```javascript
   const appRoot = document.getElementById('app');
   ```

4. **Create Component Instance**
   - Pass `store.getState()` as initial state
   - Pass update callback: `(update) => { store.setState(update); }`
   ```javascript
   const interaction = InteractionModule(store.getState(), (update) => {
       store.setState(update);
   });
   ```

5. **Mount Component to DOM**
   ```javascript
   appRoot.appendChild(interaction.element);
   ```

6. **Subscribe to State Changes**
   - Call component's `update()` method when state changes
   ```javascript
   store.subscribe((newState) => {
       interaction.update(newState);
   });
   ```

**Complete main.js Template**:
```javascript
import { createStore } from './core/store.js';
import { InteractionModule } from './components/InteractionModule.js';

// 1. Initialize State
const store = createStore({ text: '' });

// 2. Select Root
const appRoot = document.getElementById('app');

// 3. Initialize Component
const interaction = InteractionModule(store.getState(), (update) => {
    store.setState(update);
});

appRoot.appendChild(interaction.element);

// 4. Subscribe to changes (Reactivity)
store.subscribe((newState) => {
    interaction.update(newState);
});
```

---

## Provided Resources

The following files are provided and must NOT be regenerated:

### src/core/store.js
- Exports: `createStore(initialState)`
- Returns: `{ getState, setState, subscribe }`
- Implements immutable state updates and Pub/Sub pattern

### src/components/InteractionModule.js
- Exports: `InteractionModule(state, onAction)`
- Returns: `{ element, update }`
- Contains:
  - Readonly text input (`data-ref="display"`, `name="text"`)
  - Button (`data-ref="trigger"`, label "Hold Me")
- Behavior:
  - `mousedown` on button → `onAction({ text: 'Click!' })`
  - `mouseup` on button → `onAction({ text: '' })`
  - `mouseleave` on button → `onAction({ text: '' })`

---

## Expected Behavior

1. User opens `index.html` in browser (requires HTTP server for ES modules)
2. App displays:
   - Empty text field (readonly)
   - Button labeled "Hold Me"
3. User presses and holds the button:
   - Text field shows "Click!"
4. User releases the button:
   - Text field clears (empty string)
5. If user drags mouse off button while holding:
   - Text field clears (empty string)

---

## Verification Checklist

After generating `index.html` and `main.js`, verify:

- [ ] `index.html` has `id="app"` div
- [ ] Script tag uses `type="module"`
- [ ] `main.js` imports from correct paths
- [ ] Store initialized with `{ text: '' }`
- [ ] Component receives `store.getState()` and update callback
- [ ] Component element appended to `#app`
- [ ] Store subscription calls `interaction.update()`
- [ ] App runs without console errors
- [ ] Button interaction updates text field correctly

---

## Extending the Demo

To add new components:

1. Create component in `src/components/NewComponent.js`
2. Import in `main.js`
3. Initialize with state and callback
4. Append to DOM
5. Add to subscription handler

```javascript
// In main.js
import { NewComponent } from './components/NewComponent.js';

const newComponent = NewComponent(store.getState(), (update) => {
    store.setState(update);
});

appRoot.appendChild(newComponent.element);

store.subscribe((newState) => {
    interaction.update(newState);
    newComponent.update(newState);
});
```
