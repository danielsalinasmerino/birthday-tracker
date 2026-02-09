---
description: "Birthday Tracker project-specific development guidelines"
applyTo: "**/*.tsx, **/*.ts, **/*.css, **/*.module.css"
---

# Birthday Tracker Project Instructions

This is a Birthday Tracker application built with modern web technologies. All development should follow the guidelines outlined in this document along with the referenced instruction files.

## Technology Stack

- **React**: Modern functional components with hooks
- **TypeScript**: Type-safe development with TypeScript 5.x
- **CSS Modules**: Scoped styling with CSS Modules for component isolation
- **Vite**: Fast build tool and development server

## Project Architecture

This project follows **Hexagonal Architecture** (also known as **Ports and Adapters**), a pattern that separates business logic from infrastructure and presentation concerns. This ensures maintainability, testability, and flexibility.

Reference: [Hexagonal Architecture in Frontend](https://softwarecrafters.io/react/arquitectura-hexagonal-frontend)

### Architecture Layers

#### 1. Domain Layer (`src/domain/`)

The **core** of the application containing pure business logic, completely independent of frameworks and technologies.

- **Models** (`domain/models/`): TypeScript interfaces representing business entities (User, Group)
- **Repositories** (`domain/repositories/`): **Ports** - Interfaces defining contracts for data access
- **Use Cases** (`domain/usecases/`): Business logic functions that orchestrate operations

**Key principle:** This layer has ZERO dependencies on React, Firebase, or any external library.

```typescript
// Example: domain/usecases/userUseCases.ts
export const getUsers = (repository: UserRepository): Promise<User[]> => {
  return repository.getUsers();
};
```

#### 2. Infrastructure Layer (`src/infrastructure/`)

Contains all **technology-specific implementations** and external integrations.

- **Adapters** (`infrastructure/adapters/`): Concrete implementations of repository interfaces (e.g., FirebaseRepository)
- **Configuration** (`infrastructure/firebase/`): External service configurations
- **Instances** (`infrastructure/instances/`): Singleton instances of repositories

**Key principle:** Adapters implement domain interfaces. Swapping technologies (Firebase → Supabase) only requires changing this layer.

```typescript
// Example: infrastructure/adapters/FirebaseRepository.ts
export class FirebaseUserRepository implements UserRepository {
  async getUsers(): Promise<User[]> {
    // Firebase-specific implementation
  }
}
```

#### 3. Presentation Layer (`src/components/`)

React components that render the UI. They interact with the domain through use cases.

**Key principle:** Components call use cases with injected repositories. No direct Firebase/database calls.

```typescript
// Example: Component using the architecture
import { getUsers } from "./domain/usecases";
import { userRepository } from "./infrastructure/instances/repositories";

const users = await getUsers(userRepository);
```

### Component Structure

- Use functional components with TypeScript
- Implement proper prop typing with TypeScript interfaces
- Keep components focused and single-purpose
- Use CSS Modules for component-specific styles
- **Never import infrastructure adapters directly** - always use domain use cases

### Styling Guidelines

- **CSS Modules Only**: All component styles must use CSS Modules (`.module.css` extension)
- File naming: `ComponentName.module.css` paired with `ComponentName.tsx`
- Import styles as: `import styles from './ComponentName.module.css'`
- Apply classes using: `className={styles.className}`
- Use camelCase for class names in CSS Modules
- Implement responsive design with mobile-first approach
- Use CSS custom properties for theming and reusable values

### TypeScript Standards

- Follow all guidelines from `typescript-5-es2022.instructions.md`
- Use strict type checking
- Define interfaces for component props, state, and game logic
- Leverage TypeScript's type inference when appropriate
- Use proper typing for React hooks and event handlers

### React Patterns

- Follow all best practices from `reactjs.instructions.md`
- Use hooks for state management (`useState`, `useEffect`, `useMemo`, `useCallback`)
- Implement proper component composition
- Keep business logic separate from presentation
- Use custom hooks for reusable birthday data logic

## Application-Specific Guidelines

### State Management

- Maintain application state at appropriate component levels
- Track birthday data, user inputs, and filter states
- Implement data persistence (localStorage or backend API)
- Use immutable state updates

### Data Management

- Implement clean, testable functions for birthday operations (add, edit, delete)
- Separate data validation logic from rendering logic
- Handle edge cases (invalid dates, duplicate entries)
- Validate user inputs before state updates

### User Experience

- Provide clear visual feedback for upcoming birthdays
- Highlight birthdays happening soon or today
- Show birthday countdowns or age calculations
- Implement smooth transitions and animations
- Ensure accessibility with proper ARIA labels and keyboard navigation

## Code Organization

Following Hexagonal Architecture principles:

```
src/
  domain/                        # 🎯 DOMAIN LAYER (Core Business Logic)
    models/                      # Business entities
      User.ts                    # User entity interface
      Group.ts                   # Group entity interface
      index.ts                   # Model exports
    repositories/                # 🔌 PORTS (Interfaces)
      Repository.ts              # Repository interfaces (UserRepository, GroupRepository)
    usecases/                    # Application use cases
      userUseCases.ts            # User business logic (getUsers, addUser, etc.)
      groupUseCases.ts           # Group business logic
      index.ts                   # Use case exports

  infrastructure/                # 🔧 INFRASTRUCTURE LAYER (Technology)
    adapters/                    # 🔌 ADAPTERS (Implementations)
      FirebaseRepository.ts      # Firebase implementation of repositories
    firebase/                    # External service configuration
      config.ts                  # Firebase initialization
    instances/                   # Repository instances
      repositories.ts            # Singleton repository instances

  components/                    # 🎨 PRESENTATION LAYER (React)
    BirthdayList/               # Birthday list component with .tsx and .module.css
    BirthdayCard/               # Birthday card component with .tsx and .module.css
    GroupDetail/                # Group detail component
    UserGroups/                 # User groups component

  hooks/                        # Custom React hooks
  utils/                        # Utility functions (date calculations, validators)
  types/                        # Type re-exports from domain (for backward compatibility)
  styles/                       # Global styles and CSS variables
```

### Layer Dependencies

```
Presentation (React Components)
        ↓ (depends on)
Domain (Use Cases + Interfaces)
        ↑ (implemented by)
Infrastructure (Adapters)
```

**Rule:** Domain never depends on Infrastructure or Presentation. Dependencies point inward.

## Development Workflow

### Adding a New Feature (Hexagonal Architecture)

Follow this order to maintain clean architecture:

1. **Define the Model** (`domain/models/`)
   - Create TypeScript interface for the new entity
   - Export from `domain/models/index.ts`

2. **Define Repository Interface** (`domain/repositories/Repository.ts`)
   - Add interface with method signatures (Port)
   - Define contracts for data operations

- **Hexagonal Architecture**: See `ARCHITECTURE.md` in project root for detailed architecture documentation
- **Software Crafters Article**: [Arquitectura Hexagonal en el FrontEnd](https://softwarecrafters.io/react/arquitectura-hexagonal-frontend) - Original reference

## Architecture Benefits

This hexagonal architecture provides:

- **Maintainability:** Clear separation makes code easier to understand and modify
- **Testability:** Business logic can be tested independently of Firebase
- **Flexibility:** Easy to swap technologies (Firebase → Supabase, etc.)
- **Scalability:** New features follow established, repeatable patterns
- **Team Collaboration:** Different teams can work on different layers independently
- **Reduced Coupling:** Changes in one layer don't cascade to others

3. **Create Use Cases** (`domain/usecases/`)
   - Implement business logic functions

### General

- Write self-documenting code with clear variable and function names
- Keep functions small and focused on single responsibilities
- Use TypeScript's type system to prevent runtime errors
- Implement proper error boundaries for graceful error handling
- Write unit tests for date calculation and validation utilities
- Use React DevTools for debugging component behavior

### Hexagonal Architecture Specific

**DO:**

- ✅ Keep domain logic pure and framework-agnostic
- ✅ Use dependency injection (pass repositories to use cases)
- ✅ Define interfaces in domain, implement in infrastructure
- ✅ Test use cases with mock repositories
- ✅ Keep adapters thin (just data mapping and API calls)
- ✅ Import use cases and repository instances in components

**DON'T:**

- ❌ Import Firebase directly in domain or components
- ❌ Put business logic in adapters or components
- ❌ Import adapters directly (use instances instead)
- ❌ Mix presentation concerns with business logic
- ❌ Create circular dependencies between layers
- ❌ Leak infrastructure details into domain types

### Testing Strategy

- **Domain Layer:** Unit tests with mock repositories (no Firebase needed)
- **Infrastructure Layer:** Integration tests with real Firebase (or emulator)
- **Presentation Layer:** Component tests with mock use cases

Example:

```typescript
// Testing use cases (domain)
const mockRepo: UserRepository = {
  getUsers: async () => [{ id: "1", name: "Test", birthDate: new Date() }],
};
const users = await getUsers(mockRepo); // Pure, fast, no dependencies!
```

- Handle all technology-specific logic here

5. **Create Instance** (`infrastructure/instances/repositories.ts`)
   - Instantiate the adapter
   - Export singleton instance

6. **Build UI Components** (`components/`)
   - Import use cases from domain
   - Import repository instances from infrastructure
   - Call use cases with repository as dependency
   - Style using CSS Modules with scoped class names

7. **Test & Validate**
   - Test business logic with mock repositories
   - Ensure accessibility compliance
   - Optimize performance where needed

### Example: Adding "Reminders" Feature

```typescript
// 1. domain/models/Reminder.ts
export interface Reminder {
  id: string;
  userId: string;
  daysBefore: number;
}

// 2. domain/repositories/Repository.ts
export interface ReminderRepository {
  getReminders(userId: string): Promise<Reminder[]>;
  addReminder(reminder: Omit<Reminder, "id">): Promise<string>;
}

// 3. domain/usecases/reminderUseCases.ts
export const getReminders = (
  repository: ReminderRepository,
  userId: string,
): Promise<Reminder[]> => {
  return repository.getReminders(userId);
};

// 4. infrastructure/adapters/FirebaseRepository.ts
export class FirebaseReminderRepository implements ReminderRepository {
  async getReminders(userId: string): Promise<Reminder[]> {
    // Firebase implementation
  }
}

// 5. infrastructure/instances/repositories.ts
export const reminderRepository = new FirebaseReminderRepository(db);

// 6. components/ReminderList/ReminderList.tsx
import { getReminders } from "../../domain/usecases";
import { reminderRepository } from "../../infrastructure/instances/repositories";

const reminders = await getReminders(reminderRepository, userId);
```

## Referenced Instructions

- **React Development**: See `reactjs.instructions.md` for comprehensive React patterns and best practices
- **TypeScript Standards**: See `typescript-5-es2022.instructions.md` for TypeScript 5.x guidelines and ES2022 features

## Best Practices

- Write self-documenting code with clear variable and function names
- Keep functions small and focused on single responsibilities
- Use TypeScript's type system to prevent runtime errors
- Implement proper error boundaries for graceful error handling
- Write unit tests for date calculation and validation utilities
- Use React DevTools for debugging component behavior

## Performance Considerations

- Memoize expensive calculations with `useMemo`
- Use `React.memo` for components that render frequently
- Optimize re-renders by proper state placement
- Profile performance with React DevTools when needed
