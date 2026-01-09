# Vanilla Spirit: Instruction-Driven Development (IDD)

Vanilla Spirit is an experimental approach to building scalable web applications using pure vanilla JavaScript, without relying on heavy frameworks like React or Vue. Instead of embedding logic in a library, we shift the "framework" into a set of living, human-readable instructions that guide AI coding agents (and developers) in maintaining consistency, performance, and scalability.

This project demonstrates **Instruction-Driven Development (IDD)**: a methodology where documentation and "proven code" examples serve as the "compiler" for AI agents. By treating blueprints as executable rules, you gain the speed and control of vanilla JS with the organizational benefits of a framework—without the dependency bloat or breaking changes.

## Core Philosophy

Traditional frameworks enforce patterns through code (e.g., React's `useState` hook). IDD enforces them through instructions. The result? Zero-kilobyte frameworks that any AI (Copilot, Claude, GPT) can instantly adopt by reading your Markdown blueprints.

- **Performance**: Ship vanilla JS—fast, lightweight, and framework-free.
- **Control**: You're not tied to a library's roadmap; evolve your own "private framework" as needed.
- **AI Portability**: Blueprints are plain text, so any LLM can understand and implement your architecture.

## How It Works

### 1. The Blueprint Architecture: `.github/blueprints`
Blueprints are the "source of truth" for AI agents. Stored in a structured directory, they define rules, patterns, and conventions.

- **`architecture.md`**: High-level flow (e.g., "All state changes must trigger a `CustomEvent` on the window object").
- **`patterns/`**: Directory of approved patterns.
  - `component-structure.md`: Defines how a vanilla JS component should handle internal state, event listeners, and cleanup.
  - `state-management.md`: Rules for one-way data flow and immutability.
- **`glossary.md`**: Naming conventions (e.g., "DOM-modifying functions must be prefixed with `render`").

Blueprints evolve with the codebase—see the [Lifecycle](#lifecycle-of-the-blueprint) below.

### 2. The "Reference Gallery" (Proven Code): `references/`
AI agents learn best from examples. This directory contains minimal, perfect implementations of your patterns—never imported by the app, only used as templates.

- **Purpose**: When assigning a task, reference a gallery item: "Build a new `UserProfile` component following `references/base-component.js`."
- **Validation**: Ensures agents "hallucinate" within architectural boundaries.
- **Example**: `references/interaction-module.js` (a simple reactive component).

### 3. Lifecycle of the Blueprint
Blueprints are living documents, updated through a disciplined cycle:

| Phase       | Action                                                                 | Responsible Party   |
|-------------|------------------------------------------------------------------------|---------------------|
| **Expansion** | Developer manually builds a complex feature (e.g., a custom Router).  | Developer          |
| **Abstraction** | Extract rules into a new Blueprint file (e.g., `routing-rules.md`).    | Developer + AI Agent |
| **Approval** | PR and review the Blueprint; merge to make it "law."                   | Lead Developer     |
| **Execution** | AI agent reads the Blueprint and generates code (e.g., adds a new page). | AI Agent          |

### 4. Integration with GitHub Copilot
Leverage `.github/copilot-instructions.md` to make Blueprints actionable:

```
# Vanilla JS Framework Rules
You are an expert at building scalable web apps without frameworks.

## 1. Architecture Reference
Always follow patterns in:
- .github/blueprints/state-management.md
- references/base-component.js
```

### 5. Automated "Blueprint Linting"
Use a GitHub Action for semantic validation:
- **Trigger**: On PR open.
- **Check**: Compare changed files against Blueprints (e.g., "Does this module use the approved Pub/Sub model?").
- **Feedback**: Comment on deviations (e.g., "Architectural Deviation: Direct state mutation detected instead of `CustomEvent`").

## Getting Started

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/tvmanus/vanilla-spirit.git
   cd vanilla-spirit
   ```

2. **Run Locally** (Requires a server for ES modules):
   ```bash
   python -m http.server 8000  # Or use any static server
   ```
   Open `http://localhost:8000` in your browser.

3. **Explore the Demo**: Hold the "Hold Me" button to see reactive state updates.

4. **Contribute**:
   - Read the [Blueprint](./BLUEPRINT.md) (legacy; migrate to `.github/blueprints`).
   - Add to `references/` for new patterns.
   - Propose Blueprint updates via PR.

## Current Implementation
- **State Store**: Pub/Sub model with immutability.
- **Components**: Functional, encapsulated modules (e.g., `InteractionModule`).
- **Reactivity**: Selective DOM updates via subscriptions.

## Benefits Summary
- **Zero Dependency Bloat**: Ship 0kb of framework code.
- **Total Control**: Avoid framework breaking changes.
- **Agent Portability**: Blueprints are LLM-readable Markdown/JS.

## Roadmap
- Migrate to `.github/blueprints` structure.
- Expand `references/` with more components (e.g., Router, Forms).
- Implement Blueprint Linting Action.
- Add end-to-end examples (e.g., a full app).

Inspired by the need for AI-human collaboration in code. Contributions welcome—let's redefine "frameworks"!

Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): 2026-01-09 04:33:39
Current User's Login: tvmanus