# VanillaSpirit Blueprints

This directory contains the architectural blueprints for VanillaSpirit projects. These documents serve as the "source of truth" for AI coding agents and developers.

## Directory Structure

```
blueprints/
├── README.md                    # This file
├── architecture.md              # Core application architecture
├── coding-standards.md          # Code style and conventions
├── glossary.md                  # Terminology and naming reference
├── patterns/                    # Reusable implementation patterns
│   ├── component-structure.md   # Component template and rules
│   └── state-management.md      # Store implementation and usage
└── apps/                        # Application-specific blueprints
    └── demo-app.md              # Demo application specification
```

## How to Use

### For AI Agents
1. Read `architecture.md` first to understand the project structure
2. Reference `patterns/` when implementing components or state
3. Follow `coding-standards.md` for style consistency
4. Use `glossary.md` for naming conventions
5. Check `apps/` for application-specific requirements

### For Developers
1. Review blueprints before contributing
2. Propose changes via PR
3. Update blueprints when adding new patterns
4. Use app blueprints as feature specifications

## Blueprint Lifecycle

| Phase | Action | Responsible |
|-------|--------|-------------|
| Expansion | Build new feature manually | Developer |
| Abstraction | Extract rules into blueprint | Developer + AI |
| Approval | Review and merge blueprint | Lead Developer |
| Execution | Generate code from blueprint | AI Agent |

## Adding New Blueprints

1. **Patterns**: Add to `patterns/` for reusable implementation patterns
2. **Apps**: Add to `apps/` for application-specific specifications
3. **Core**: Update root-level files for architectural changes

Always include:
- Clear scope definition
- Implementation templates
- Rules and anti-patterns
- Verification checklist
