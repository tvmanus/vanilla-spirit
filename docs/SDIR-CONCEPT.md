# Self-Defining Intermediate Representation (SDIR)

## Overview

SDIR (Self-Defining Intermediate Representation) is a meta-programming approach where architectural blueprints define their own syntax, semantics, and validation rules within themselves. Unlike fixed Domain-Specific Languages (DSLs) that require external compilers, SDIR blueprints are **self-interpreting documents** that bootstrap their own metalanguage.

## The Problem with Traditional DSLs

Traditional approaches to formalizing architectural patterns suffer from rigidity:

- **TypeScript/JSON Schema Problem**: Fixed grammar requires external tooling and creates another layer of formalism
- **Framework Lock-in**: Pre-defined syntax limits evolution and adaptation
- **AI Brittleness**: Static schemas are hard for LLMs to extend or reason about
- **Maintenance Overhead**: Schema updates cascade through all dependent tools

## The SDIR Solution

SDIR treats each blueprint as a **bootstrapped language definition** that:

1. **Defines its own primitives** (syntax elements like `@rule`, `@pattern`, `@transform`)
2. **Declares its own semantics** (what `MUST`, `SHOULD`, `ANTIPATTERN` mean)
3. **Specifies composition rules** (how primitives combine and reference each other)
4. **Remains human-readable** (Markdown-first, not machine-first)
5. **Is AI-parseable** (structured enough for LLMs to extract and apply)

## Core Principles

### 1. Bootstrapping

Each blueprint starts with a `[METALANGUAGE]` section that defines how the rest of the document should be interpreted:

```markdown
## [METALANGUAGE]

Define syntax:
- `@rule(name)` := A constraint that must be satisfied
- `@pattern(name)` := A code template with variable holes
- `@constraint(name, condition)` := A logical assertion

Define semantics:
- `MUST` := Hard constraint (breaks build if violated)
- `SHOULD` := Soft constraint (warning only)
- `ANTIPATTERN` := Forbidden code pattern
```

### 2. Self-Interpretation

Unlike external DSLs, SDIR blueprints carry their own interpretation logic. An AI agent or parser:

1. Reads the `[METALANGUAGE]` section first
2. Builds a context-specific grammar from those definitions
3. Parses subsequent sections using that custom grammar
4. No global schema required

### 3. Evolutionary Compatibility

Each blueprint can:

- Define new primitives without breaking others
- Extend existing primitives with new semantics
- Import metalanguage definitions from other blueprints
- Maintain backward compatibility (old blueprints keep their definitions intact)

## SDIR Structure

A typical SDIR blueprint contains these sections:

### [METALANGUAGE]
Bootstraps the interpretation framework. Defines:
- **Syntax**: What symbols and constructs exist (`@rule`, `@pattern`, etc.)
- **Semantics**: What those constructs mean (`MUST`, `SHOULD`, etc.)
- **Composition**: How constructs can combine or reference each other

### [RULES]
Declares constraints and requirements using the metalanguage:
```markdown
@rule(component-signature)
  MUST: return value matches `{ element: HTMLElement, update: Function }`
  ANTIPATTERN: `export default function() { ... }`
```

### [PATTERNS]
Defines code templates with variable substitution:
```markdown
@pattern(component-factory)
```javascript
export function {ComponentName}(state, onAction) {
  // @inject(component-body)
  return { element, update };
}
```
```
### [TRANSFORMATIONS]
Specifies code refactoring and migration rules:
```markdown
@transform(from: "state.{prop} = {value}", to: "setState({ {prop}: {value} })")
```

### [VERIFICATION]
Declares how to validate code against the blueprint:
```markdown
Check: All functions match @pattern(component-factory)
Check: No code matches any ANTIPATTERN
```

## Comparison to Other Approaches

| Approach | Extensibility | Readability | Tooling Required | AI-Friendly |
|----------|--------------|-------------|------------------|-------------|
| **YAML/JSON DSL** | Low (schema changes) | Low (machine-first) | High (parsers, validators) | Medium |
| **TypeScript** | Medium (type system limits) | Medium | High (compiler) | Low |
| **Free-form Markdown** | High | High | None | High (but no validation) |
| **SDIR** | **High** | **High** | **Low** (self-interpreting) | **High** |

## Benefits for Vanilla Spirit

### 1. True Meta-Programming
Blueprints become executable IR that can generate, validate, and refactor code—not just document it.

### 2. Zero External Dependencies
No separate DSL compiler, schema validator, or type checker needed. The blueprint is the specification AND the validator.

### 3. AI-Native Design
LLMs can:
- Parse the metalanguage to understand blueprint structure
- Generate code by filling pattern templates
- Validate code against rules
- Propose blueprint extensions in the same metalanguage

### 4. Evolutionary Architecture
New patterns can be added by:
- Defining new primitives in `[METALANGUAGE]`
- Adding new rules/patterns that use those primitives
- No global schema updates or breaking changes

### 5. Human-First, Machine-Readable
Unlike DSLs that prioritize parsing, SDIR prioritizes human understanding while remaining structured enough for tools.

## Implementation Path

### Phase 1: Prototype (1-2 blueprints)
- Add `[METALANGUAGE]` sections to component-structure and state-management
- Define core primitives: `@rule`, `@pattern`, `@antipattern`, `@transform`
- Document semantics: `MUST`, `SHOULD`, `EXAMPLE`

### Phase 2: Parser Development
- Create `scripts/parse-sdir.js` to extract metalanguage definitions
- Build dynamic grammar from metalanguage
- Implement rule validation against code

### Phase 3: AI Integration
- Enhance `.github/copilot-instructions.md` with SDIR parsing instructions
- Create GitHub Action for automated code generation from blueprints
- Add PR validation using SDIR rules

### Phase 4: Expansion
- Convert remaining blueprints to SDIR format
- Add advanced primitives (dependencies, lifecycle, transformations)
- Build ecosystem of interoperable blueprints

## Example Use Cases

### Code Generation
```
Input: "Create a UserProfile component with name and email fields"
Process:
  1. Parse component-structure blueprint metalanguage
  2. Extract @pattern(component-factory)
  3. Fill template holes: {ComponentName} = "UserProfile"
  4. Generate code matching the pattern
  5. Validate against @rule(component-signature)
```

### Code Validation
```
Input: Pull request with new component code
Process:
  1. Parse relevant blueprints' [RULES] sections
  2. Check code against each @rule
  3. Detect any ANTIPATTERN matches
  4. Report violations as PR comments
```

### Code Migration
```
Input: Legacy code using `state.value = x`
Process:
  1. Parse @transform rules from blueprint
  2. Match pattern: "state.{prop} = {value}"
  3. Apply transformation: "setState({ {prop}: {value} })"
  4. Generate refactored code
```

## Philosophical Alignment

SDIR embodies the core philosophy of Vanilla Spirit:

- **Instruction-Driven Development**: Patterns enforced through documentation, not framework code
- **Zero-Framework Freedom**: No external compiler or runtime required
- **AI Portability**: LLMs can read, understand, and extend the metalanguage
- **Explicit Over Magic**: All behavior is traceable and documented

By making blueprints self-defining, we achieve true intermediate representation—not just documentation, but executable architecture that compiles itself.

---

**Status**: Experimental concept for evolution toward IR-style meta-programming

**See Also**: 
- `docs/SDIR-component-structure.md` - Example SDIR blueprint
- `.github/blueprints/patterns/component-structure.md` - Original blueprint
- `README.md` - Vanilla Spirit overview