# Hexagonal Architecture - Birthday Tracker

This project follows **Hexagonal Architecture** (also known as **Ports and Adapters**) to ensure clean separation of concerns and maintainability.

## 📁 Project Structure

```
src/
├── domain/                      # 🎯 DOMAIN LAYER (Business Logic)
│   ├── models/                  # Domain entities
│   │   ├── User.ts             # User entity
│   │   ├── Group.ts            # Group entity
│   │   └── index.ts            # Model exports
│   ├── repositories/            # 🔌 PORTS (Interfaces)
│   │   └── Repository.ts       # Repository interfaces
│   └── usecases/                # Application use cases
│       ├── userUseCases.ts     # User business logic
│       ├── groupUseCases.ts    # Group business logic
│       └── index.ts            # Use case exports
│
├── infrastructure/              # 🔧 INFRASTRUCTURE LAYER
│   ├── adapters/                # 🔌 ADAPTERS (Implementations)
│   │   └── FirebaseRepository.ts  # Firebase implementation
│   ├── firebase/                # Firebase configuration
│   │   └── config.ts           # Firebase initialization
│   └── instances/               # Repository instances
│       └── repositories.ts     # Singleton repository instances
│
└── components/                  # 🎨 PRESENTATION LAYER (React)
    ├── UserGroups/
    ├── GroupDetail/
    └── BirthdayCard/
```

## 🏛️ Architecture Layers

### 1. Domain Layer (Core)

**Location:** `src/domain/`

Contains the business logic, completely independent of any framework or technology.

- **Models:** Pure TypeScript interfaces representing business entities
- **Repositories (Ports):** Interfaces defining contracts for data access
- **Use Cases:** Business logic functions that orchestrate operations

**Key principle:** This layer has **NO dependencies** on infrastructure or frameworks.

### 2. Infrastructure Layer

**Location:** `src/infrastructure/`

Contains all technology-specific implementations.

#### Adapters

Concrete implementations of the repository interfaces (ports). Currently:

- **FirebaseRepository:** Implements data access using Firebase/Firestore

#### Why Adapters?

- Easy to swap technologies (e.g., Firebase → Supabase)
- Testable (can create mock adapters)
- Changes to external APIs don't propagate to domain

### 3. Presentation Layer

**Location:** `src/components/`

React components that render the UI. They:

- Import use cases from the domain layer
- Receive repository instances as dependencies
- Call use cases with the repository instance

## 🔄 Data Flow

```
User Interaction
      ↓
React Component (Presentation)
      ↓
Use Case (Domain)
      ↓
Repository Interface (Port)
      ↓
Firebase Adapter (Infrastructure)
      ↓
Firebase/Firestore
```

## 💡 Key Principles

### Dependency Inversion

The domain layer defines interfaces (ports), and the infrastructure layer implements them (adapters). The domain **never** depends on infrastructure.

### Single Responsibility

Each layer has one clear purpose:

- **Domain:** Business rules
- **Infrastructure:** Technology integration
- **Presentation:** User interface

### Testability

- Mock repositories for testing use cases
- Test business logic independently from Firebase
- Easy to write unit tests

## 🛠️ How to Add Features

### Adding a new entity (e.g., "Event")

1. **Create model** in `domain/models/Event.ts`
2. **Define repository interface** in `domain/repositories/Repository.ts`
3. **Create use cases** in `domain/usecases/eventUseCases.ts`
4. **Implement adapter** in `infrastructure/adapters/FirebaseRepository.ts`
5. **Create instance** in `infrastructure/instances/repositories.ts`
6. **Use in components** by importing use cases and repository instances

### Switching from Firebase to another database

1. Create new adapter (e.g., `SupabaseRepository.ts`)
2. Implement the same repository interfaces
3. Update `infrastructure/instances/repositories.ts` to use new adapter
4. **No changes needed** in domain or presentation layers!

## 📚 Example Usage

```typescript
// In a React component
import { getUsers } from "./domain/usecases";
import { userRepository } from "./infrastructure/instances/repositories";

// Fetch users
const users = await getUsers(userRepository);
```

## 🎯 Benefits

✅ **Maintainability:** Clear separation makes code easier to understand and modify  
✅ **Testability:** Business logic can be tested independently  
✅ **Flexibility:** Easy to swap technologies (databases, APIs)  
✅ **Scalability:** New features follow established patterns  
✅ **Team collaboration:** Different teams can work on different layers

## 📖 References

- [Hexagonal Architecture in Frontend](https://softwarecrafters.io/react/arquitectura-hexagonal-frontend) (Spanish)
- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
