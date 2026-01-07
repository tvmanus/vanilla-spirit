# VanillaSpirit Blueprint

This document serves as the "Source of Truth" for the architectural patterns of this project. Every coding agent must adhere to these rules to ensure consistency without a framework.

## 1. Component Architecture
- **Functional Definition**: Components are functions that return a DOM element.
- **Encapsulation**: Styles and logic related to a component must be scoped to that component.
- **State Props**: Components receive a `state` object and an `updateState` callback.

## 2. State Management (The "React Spirit")
- **One-Way Data Flow**: State flows down from the root.
- **Immutability**: Never mutate state directly. Use the `dispatch` pattern or a provided `setState` wrapper.
- **Reactivity**: When state changes, components should selectively re-render or update their specific DOM nodes based on data-attributes.

## 3. Implementation Rules
- **Selectors**: Use `data-component` and `data-ref` attributes for DOM selection. Avoid IDs or generic class names for logic.
- **Events**: Use standard event listeners. For cross-component communication, use `CustomEvent`.
- **Lifecycle**: 
    - `init()`: Create element and bind events.
    - `render(state)`: Update the visual representation.

## 4. Coding Style
- Use ES6 Modules.
- No global variables.
- Descriptive naming: `handleButtonClick`, `renderTextField`.
