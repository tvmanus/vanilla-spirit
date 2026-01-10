This is a set of notes for human developers, AI coding assistant should ignore this (at least try to ignore)
A developer may move out this file outside of the tree if needed.

=================================================
To reproduce the demo application use the following prompt:
=================================================
Read and follow the blueprints in the following order to reproduce the demo application:

1. Start with core principles: Read `.github/blueprints/architecture.md` for overall app structure and data flow.
2. Review coding standards: Read `.github/blueprints/coding-standards.md` for style, naming, and best practices.
3. Check terminology: Read `.github/blueprints/glossary.md` for key terms and conventions.
4. Study patterns: Read `.github/blueprints/patterns/component-structure.md` and `.github/blueprints/patterns/state-management.md` for implementation templates.
5. Apply to the demo: Read `.github/blueprints/apps/demo-app.md` for the complete specification, including bootstrap sequence and verification steps.

Using the provided resources (`src/core/store.js` and `src/components/InteractionModule.js`), generate `index.html` and `main.js` to exactly match the demo app's functionality. Ensure all code adheres to the blueprints, with no direct state mutations, proper data attributes, and selective DOM updates.
===================================================