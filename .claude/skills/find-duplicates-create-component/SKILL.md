---
name: find-duplicates-create-component
description: Search codebase for duplicate code patterns and abstract them into generic, reusable components. Identifies similar implementations across files, extracts common logic, and generates composable components with configurable props. Use when refactoring code, eliminating duplication, creating component libraries, or when the user mentions "duplicate code", "extract component", or "make it generic".
---

# Find Duplicates & Create Components

## Quick Start

When finding and abstracting duplicate code:

1. **Search for patterns**: Use Grep/SemanticSearch to find similar code implementations across the codebase
2. **Identify variations**: Note what differs between duplicates (prop names, event handlers, styling, conditional logic)
3. **Extract to component**: Create a new component that accepts the differences as props
4. **Replace duplicates**: Update all instances to use the new component
5. **Verify**: Test edge cases and ensure all variations still work

## Finding Duplicates

### Strategy 1: Pattern Matching
Search for distinctive function/component names, hook patterns, or structural similarities:
```bash
# Search for similar patterns
rg "const.*=.*\(.*\).*=>" --type ts --type tsx  # Arrow function patterns
rg "useEffect.*\[\]" --type ts --type tsx  # Similar useEffect patterns
```

### Strategy 2: Semantic Search
Use SemanticSearch to find code by meaning:
- Query: "Where do we fetch and cache user data?"
- Query: "Where are loading spinners displayed?"
- Query: "How do we validate form inputs?"

### Strategy 3: Visual Code Inspection
Review components that seem related or serve similar purposes. Look for:
- Repeated state management patterns
- Identical conditional rendering logic
- Similar prop structures
- Duplicate error/loading states

## Abstraction Pattern

When creating a generic component from duplicates, follow this pattern:

### Step 1: Identify Differences
List what varies between implementations:
```
Duplicate 1: Card with title, onClick handler
Duplicate 2: Card with description, no handler
Duplicate 3: Card with badge, custom styling
```

### Step 2: Create Props Interface
Define props for configurable parts:
```typescript
interface CardProps {
  title: string;
  description?: string;
  badge?: string;
  onClick?: () => void;
  className?: string;
}
```

### Step 3: Build Flexible Component
Create component with:
- Clear, descriptive prop names
- Sensible defaults for optional props
- Composition-friendly structure
- Support for children when appropriate

### Step 4: Handle Edge Cases
Consider:
- What if a required prop is missing?
- What if multiple optional props are provided?
- How should empty states render?
- What keyboard interactions should work?

## Component Design Checklist

- [ ] Component solves the duplication problem
- [ ] Props are clear and descriptive
- [ ] Defaults make sense for most use cases
- [ ] Component is composable (accepts children, className, etc.)
- [ ] Variations are prop-driven, not new components
- [ ] TypeScript types are explicit
- [ ] Edge cases are handled gracefully
- [ ] All duplicate instances now use the new component
- [ ] No new duplication introduced in the component

## Implementation Order

1. **Search and analyze** - Find all instances of the pattern
2. **Extract component** - Create generic version in appropriate location
3. **Test original cases** - Verify component handles all current use cases
4. **Replace incrementally** - Update one instance, test, then move to next
5. **Remove originals** - Delete duplicate code once all instances migrated
6. **Final verification** - Test entire feature end-to-end

## Composition Tips

Make components more reusable:
- Accept `className` for styling variations
- Support `children` for content flexibility
- Use render props or slots for complex layouts
- Keep components focused on single responsibility
- Use TypeScript discriminated unions for variant support

## Anti-Patterns to Avoid

- Creating components with 20+ props (sign you need multiple components)
- Component that's only used once (premature abstraction)
- Variants that are fundamentally different UIs (create separate components instead)
- Props that are never actually used by callers
- Overly complex prop combinations that create hard-to-use APIs
