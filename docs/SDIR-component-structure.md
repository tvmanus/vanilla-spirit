# Component Structure Pattern (SDIR Edition)

> **Scope**: SDIR-enhanced blueprint defining canonical structure for VanillaSpirit components using self-defining metalanguage.

---

## [METALANGUAGE]

### Syntax Definitions

This blueprint uses the following primitives:

- **`@rule(name)`** := A constraint that code must satisfy
- **`@pattern(name, ...params)`** := A code template with substitution holes `{placeholder}`
- **`@antipattern(name)`** := Forbidden code pattern that must not appear
- **`@constraint(condition)`** := Logical assertion about code structure
- **`@inject(location)`** := Placeholder for user-defined code within a pattern
- **`@transform(from, to)`** := Refactoring rule for code migration
- **`@check(validation)`** := Verification step for blueprint compliance

### Semantic Definitions

Enforcement levels:

- **`MUST`** := Hard constraint - code violating this fails validation
- **`SHOULD`** := Soft constraint - code violating this triggers warning
- **`MUST_NOT`** := Hard anti-constraint - code matching this is forbidden
- **`EXAMPLE`** := Reference implementation demonstrating the rule
- **`REASONING`** := Explanation of why a rule exists

### Composition Rules

- Rules can reference other rules: `@rule(parent) requires @rule(child)`
- Patterns can embed patterns: `@pattern(outer) contains @inject(inner-pattern)`
- Constraints can be composed: `@constraint(A AND B)`
- Transforms can chain: `@transform(A→B) then @transform(B→C)`

---

## [RULES]

### @rule(component-signature)

**MUST**: Function signature matches canonical form

```javascript
export function {ComponentName}(state, onAction) {
  // implementation
  return { element, update };
}
```

**@constraint**: 
- Function name is PascalCase
- Parameters are exactly: `(state, onAction)`
- Return type is `{ element: HTMLElement, update: Function }`

**REASONING**: Standardized signature enables interoperability and AI code generation

**ANTIPATTERN**:
```javascript
// MUST_NOT: Default exports
export default function(state) { ... }

// MUST_NOT: Non-standard return
export function Component() {
  return document.createElement('div');
}
```

---

### @rule(container-creation)

**MUST**: Root container uses `data-component` attribute

**@pattern**: See `@pattern(create-container)`

**@constraint**:
- Container created with `document.createElement()`
- `data-component` attribute value is kebab-case version of component name
- Container encapsulates all component DOM

**REASONING**: Enables component identification without IDs or classes

**ANTIPATTERN**:
```javascript
// MUST_NOT: Using ID for component root
const container = document.createElement('div');
container.id = 'myComponent'; // Forbidden

// MUST_NOT: Using class for component identification
container.className = 'component'; // Forbidden for logic
```

---

### @rule(immutable-state)

**MUST**: State updates use `onAction` callback, never direct mutation

**@constraint**:
- No direct assignment to `state` properties
- All state changes go through `onAction({ updates })`
- State parameter treated as read-only

**REASONING**: Maintains one-way data flow and predictable state changes

**ANTIPATTERN**:
```javascript
// MUST_NOT: Direct state mutation
state.value = 'new value';
state.items.push(item);
Object.assign(state, updates);
```

**EXAMPLE**:
```javascript
// Correct: Using onAction
button.addEventListener('click', () => {
  onAction({ value: input.value });
});
```

---

### @rule(selective-updates)

**MUST**: Update function only modifies changed DOM elements

**@constraint**:
- Compare new state with current DOM values before updating
- Never rebuild entire component in `update()`
- Never call `innerHTML` in update function

**REASONING**: Performance optimization and event listener preservation

**ANTIPATTERN**:
```javascript
// MUST_NOT: Full re-render
const update = (newState) => {
  container.innerHTML = `...`; // Loses event listeners!
};
```

**EXAMPLE**:
```javascript
// Correct: Selective update
const update = (newState) => {
  if (input.value !== newState.value) {
    input.value = newState.value;
  }
};
```

---

### @rule(data-attributes)

**MUST**: Use `data-ref` for internal element selection

**MUST_NOT**: Use IDs or classes for JavaScript logic

**@constraint**:
- All queryable elements have `data-ref` attribute
- Use `container.querySelector('[data-ref="name"]')` for selection
- Reserve IDs for accessibility (aria-labelledby, etc.)
- Reserve classes for CSS styling only

**REASONING**: Decouples structure from styling, prevents naming conflicts

---

### @rule(form-fields)

**MUST**: All form fields have `name` attribute

**@constraint**:
- Every `<input>`, `<textarea>`, `<select>` has unique `name`
- Name describes data purpose, not visual appearance
- Name uses camelCase convention

**REASONING**: Enables browser autofill and form submission

---

## [PATTERNS]

### @pattern(component-factory)

The canonical structure for all VanillaSpirit components:

```javascript
/**
 * {ComponentName} Component
 * {ComponentDescription}
 * 
 * @param {Object} state - Current application state
 * @param {Function} onAction - Callback to dispatch state changes
 * @returns {{ element: HTMLElement, update: Function }}
 */
export function {ComponentName}(state, onAction) {
    // ═══════════════════════════════════════════════════════════
    // 1. CREATE CONTAINER
    // ═══════════════════════════════════════════════════════════
    @inject(create-container)

    // ═══════════════════════════════════════════════════════════
    // 2. BUILD INNER HTML
    // ═══════════════════════════════════════════════════════════
    @inject(build-html)

    // ═══════════════════════════════════════════════════════════
    // 3. QUERY INTERNAL ELEMENTS
    // ═══════════════════════════════════════════════════════════
    @inject(query-elements)

    // ═══════════════════════════════════════════════════════════
    // 4. EVENT BINDINGS
    // ═══════════════════════════════════════════════════════════
    @inject(bind-events)

    // ═══════════════════════════════════════════════════════════
    // 5. UPDATE FUNCTION (Reactivity)
    // ═══════════════════════════════════════════════════════════
    @inject(update-function)

    // ═══════════════════════════════════════════════════════════
    // 6. RETURN PUBLIC INTERFACE
    // ═══════════════════════════════════════════════════════════
    return { element: container, update };
}
```

**Variables**:
- `{ComponentName}`: PascalCase name of the component
- `{ComponentDescription}`: Brief description of component purpose
- `@inject(name)`: Locations for user-defined implementation

---

### @pattern(create-container)

```javascript
const container = document.createElement('{tagName}');
container.setAttribute('data-component', '{kebab-component-name}');
```

**Variables**:
- `{tagName}`: HTML element type (default: 'div')
- `{kebab-component-name}`: Component name in kebab-case

**Example**:
```javascript
const container = document.createElement('div');
container.setAttribute('data-component', 'user-profile');
```

---

### @pattern(build-html)

```javascript
container.innerHTML = `
    {html-template}
`;
```

**Rules**:
- Use template literals for multi-line HTML
- Interpolate state values: `${state.value || ''}`
- Add `data-ref` to all elements needing JavaScript access
- Add `name` attribute to all form fields

**Example**:
```javascript
container.innerHTML = `
    <input type="text" data-ref="input" name="username" value="${state.username || ''}" />
    <button data-ref="submit">Submit</button>
`;
```

---

### @pattern(query-elements)

```javascript
const {elementName} = container.querySelector('[data-ref="{ref-name}"]');
```

**Rules**:
- Query immediately after building HTML
- Cache all references - never query same element twice
- Use scoped `container.querySelector()`, not `document.querySelector()`

**Example**:
```javascript
const input = container.querySelector('[data-ref="input"]');
const button = container.querySelector('[data-ref="submit"]');
```

---

### @pattern(bind-events)

```javascript
{element}.addEventListener('{eventType}', () => {
    onAction({ {stateUpdates} });
});
```

**Rules**:
- Bind all events in initialization phase
- Use `onAction()` for all state changes
- Include accessibility handlers (keyboard, focus)

**Example**:
```javascript
button.addEventListener('click', () => {
    onAction({ username: input.value });
});

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        onAction({ username: input.value });
    }
});
```

---

### @pattern(update-function)

```javascript
const update = (newState) => {
    // Only update if value changed (selective rendering)
    if ({element}.{property} !== newState.{stateKey}) {
        {element}.{property} = newState.{stateKey};
    }
};
```

**Rules**:
- Compare before updating to prevent unnecessary DOM changes
- Update only the specific properties that changed
- Never rebuild entire component

**Example**:
```javascript
const update = (newState) => {
    if (input.value !== newState.username) {
        input.value = newState.username;
    }
    
    if (button.disabled !== newState.isSubmitting) {
        button.disabled = newState.isSubmitting;
    }
};
```

---

## [TRANSFORMATIONS]

### @transform(legacy-state-mutation)

Refactor direct state mutations to use `onAction`:

**From**:
```javascript
state.{property} = {value};
```

**To**:
```javascript
onAction({ {property}: {value} });
```

---

### @transform(legacy-id-selector)

Refactor ID-based selection to data-attributes:

**From**:
```javascript
document.getElementById('{id}')
```

**To**:
```javascript
container.querySelector('[data-ref="{id}"]')
```

**Note**: Update HTML to add `data-ref="{id}"` attribute

---

### @transform(legacy-class-selector)

Refactor class-based logic selection to data-attributes:

**From**:
```javascript
container.querySelector('.{className}')
```

**To**:
```javascript
container.querySelector('[data-ref="{ref-name}"]')
```

---

## [VERIFICATION]

### Code Validation Checklist

Before accepting a component implementation, verify:

```
@check(component-signature): Function matches @pattern(component-factory)
@check(data-component): Root element has data-component attribute
@check(data-ref): All queried elements use data-ref
@check(form-names): All form fields have name attribute
@check(immutability): No direct state mutations detected
@check(selective-update): Update function uses conditional updates
@check(no-ids): No getElementById() calls present
@check(no-class-logic): No class-based logic selection
@check(event-callback): All state changes use onAction()
```

### Automated Validation

Run validation with:
```bash
node scripts/validate-component.js path/to/Component.js
```

Expected output:
```
✓ @rule(component-signature) - PASSED
✓ @rule(container-creation) - PASSED
✓ @rule(immutable-state) - PASSED
✓ @rule(selective-updates) - PASSED
✓ @rule(data-attributes) - PASSED
✓ @rule(form-fields) - PASSED

Component validation: PASSED (6/6 rules)
```

---

## [EXTENSIONS]

### Optional Patterns

#### @pattern(cleanup-method)

For components requiring cleanup:

```javascript
const cleanup = () => {
    // Clear timers
    clearInterval(interval);
    
    // Remove global listeners
    window.removeEventListener('resize', handleResize);
    
    // Cancel pending requests
    controller.abort();
};

return { element: container, update, cleanup };
```

#### @pattern(multiple-elements)

For components with multiple top-level elements:

```javascript
const fragment = document.createDocumentFragment();
fragment.appendChild(header);
fragment.appendChild(content);
fragment.appendChild(footer);

return { element: fragment, update };
```

---

## Usage Example

### AI Code Generation Prompt

```
Generate a UserCard component using SDIR blueprint:

Input:
- Component displays user name and email
- Has an "Edit" button that dispatches edit action
- Updates display when state.user changes

Process:
1. Parse @pattern(component-factory)
2. Fill {ComponentName} = "UserCard"
3. Build HTML with name and email inputs
4. Add event binding for edit button
5. Create selective update for user.name and user.email
6. Validate against all @rule declarations
```

### Human Implementation

```javascript
/**
 * UserCard Component
 * Displays user information with edit capability
 */
export function UserCard(state, onAction) {
    // 1. CREATE CONTAINER
    const container = document.createElement('div');
    container.setAttribute('data-component', 'user-card');

    // 2. BUILD INNER HTML
    container.innerHTML = `
        <div class="user-info">
            <span data-ref="name">${state.user?.name || 'Unknown'}</span>
            <span data-ref="email">${state.user?.email || 'N/A'}</span>
        </div>
        <button data-ref="edit-button">Edit</button>
    `;

    // 3. QUERY INTERNAL ELEMENTS
    const nameSpan = container.querySelector('[data-ref="name"]');
    const emailSpan = container.querySelector('[data-ref="email"]');
    const editButton = container.querySelector('[data-ref="edit-button"]');

    // 4. EVENT BINDINGS
    editButton.addEventListener('click', () => {
        onAction({ isEditing: true, editingUserId: state.user?.id });
    });

    // 5. UPDATE FUNCTION
    const update = (newState) => {
        if (nameSpan.textContent !== newState.user?.name) {
            nameSpan.textContent = newState.user?.name || 'Unknown';
        }
        
        if (emailSpan.textContent !== newState.user?.email) {
            emailSpan.textContent = newState.user?.email || 'N/A';
        }
        
        if (editButton.disabled !== newState.isEditing) {
            editButton.disabled = newState.isEditing;
        }
    };

    // 6. RETURN PUBLIC INTERFACE
    return { element: container, update };
}
```

---

## Comparison to Original Blueprint

| Aspect | Original Blueprint | SDIR Blueprint |
|--------|-------------------|----------------|
| Structure | Narrative documentation | Self-defining metalanguage |
| Validation | Manual checklist | Automated @check rules |
| Code Generation | Template reference | Parseable @pattern with holes |
| Refactoring | Manual guidance | Executable @transform rules |
| Extensibility | Add new sections | Define new primitives in [METALANGUAGE] |
| AI Parsing | Pattern matching on prose | Structured primitives with formal semantics |

---

**Status**: Experimental SDIR implementation

**See Also**:
- `docs/SDIR-CONCEPT.md` - SDIR philosophy and design
- `.github/blueprints/patterns/component-structure.md` - Original blueprint
- `scripts/parse-sdir.js` - SDIR parser implementation (planned)