# Firestore ORM RxJS

A powerful TypeScript ORM for Firebase Firestore with first-class RxJS support, designed for modern Angular applications. This library combines type safety, reactive programming, and Firestore's real-time capabilities to provide a seamless development experience.

## What is an ORM?

An Object-Relational Mapping (ORM) is a programming concept where an application maps object-oriented programming concepts to database concepts. In this context, an ORM is a library or framework that provides a set of tools and abstractions for working with NoSQL databases, using object-oriented programming languages like JavaScript.

## Features

- **Type-safe entities** with Zod schema validation
- **RxJS integration** for reactive queries and real-time updates
- **Rich relationships** support (one-to-one, one-to-many)
- **Intuitive API** for CRUD operations
- **TypeScript-first** approach

## Installation

```bash
npm install @la.machine.a.idees/firestore-orm-rxjs
```

## Quick Start

1. Initialize Firebase in your application:

```typescript
import { initializeOrm } from '@la.machine.a.idees/firestore-orm-rxjs';

initializeOrm({
  // Your Firebase config
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id'
});
```

2. Define your entity:

```typescript
import { Entity } from '@la.machine.a.idees/firestore-orm-rxjs';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional()
});

class UserEntity extends Entity<z.infer<typeof userSchema>> {
  constructor() {
    // Pass the Firestore collection name, schema and default data
    super('users', userSchema, { name: 'John Doe', email: 'john@example.com' });
  }
}
```

3. Register your collection:

```typescript
import { registerCollection } from '@la.machine.a.idees/firestore-orm-rxjs';

// Register once the collection with the Firestore collection name and your entity
const usersCollection = registerCollection('users', UserEntity);
```

4. Use the collection:

```typescript
// Create and save a new user
const user = new UserEntity();
user.data = {
  name: 'John Doe',
  email: 'john@example.com'
};
await user.save();

// Update a user
user.data.age = 30;
await user.save();

// Get a user
const user = await usersCollection.getById('user123');

// Query users
const users = await usersCollection.get(ref => 
  query(ref, where('age', '>', 18))
);

// Observe users in real-time
usersCollection.observe$(ref => 
  query(ref, where('age', '>', 18))
).subscribe(users => {
  console.log('Users updated:', users);
});
```

## Relationships

The library supports various types of relationships:

### One-to-One

The user Document has a property `profileId` that references the profile Document.

```typescript
class UserEntity extends Entity<z.infer<typeof userSchema>> {
  profile = this.referencesToOne<ProfileEntity>('profiles').fromKey('profileId');
}
```

### One-to-One (Inverse)

The car Document has a property `userId` that references the user Document.

```typescript
class UserEntity extends Entity<z.infer<typeof userSchema>> {
  car = this.referencesToOne<CarEntity>('cars').fromForeignKey('userId');
}
```

### One-to-Many

A post Document has a property `userId` that references the user Document.

```typescript
class UserEntity extends Entity<z.infer<typeof userSchema>> {
  posts = this.referencesToMultiple<PostEntity>('posts').fromForeignKey('userId');
}
```

### One-to-Many (Inverse)

A group Document has an array property `userIds` that references the user Documents.

```typescript
class UserEntity extends Entity<z.infer<typeof userSchema>> {
  groups = this.referencesToMultiple<GroupEntity>('groups').fromForeignArrayKey('userIds');
}
```

## Real-time Updates

Enable real-time updates on entities:

```typescript
const user = await usersCollection.getById('user123');
user.setRealtimeUpdates(true);
```

In your template, user data will be updated in real-time from Firestore updates:

```html
<div *ngIf="user">
  <p>{{ user.data.name }}</p>
  <p>{{ user.data.email }}</p>
</div>
```

## Schema Validation

The library uses Zod for runtime type checking and validation:

```typescript
import { oneReference } from '@la.machine.a.idees/firestore-orm-rxjs';

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  published: z.boolean().default(false),
  authorId: oneReference // Helper for foreign key references
});
```

For multiple foreign key references in an array, use `multipleReferences`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Test Coverage

The library is tested using Vitest and covers a wide range of use cases.

## License

MIT License
