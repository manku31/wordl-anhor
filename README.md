# Word Anchor

A vocabulary flashcard app built with **Next.js 16**, **Prisma 7**, and **Neon Postgres**. Save words with optional details, review them as animated flashcards, and manage your collection behind a secure session-based auth flow.

---

## Tech Stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Framework  | Next.js 16 (App Router)                        |
| Language   | TypeScript                                     |
| Styling    | Tailwind CSS v4 + shadcn/ui                    |
| Animation  | Framer Motion                                  |
| ORM        | Prisma 7 (driver-adapter mode, no Rust engine) |
| Database   | Neon Postgres (serverless)                     |
| DB Adapter | `@prisma/adapter-neon`                         |
| Auth       | JWT sessions via `jose` + HTTP-only cookies    |
| Password   | `bcryptjs`                                     |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
# Pooled connection — used by Prisma Client at runtime
DATABASE_URL='postgresql://<user>:<password>@<pooler-host>/<db>?sslmode=require&pgbouncer=true&connection_limit=1'

# Direct (non-pooled) connection — used by Prisma CLI for migrations / db push
DIRECT_DATABASE_URL='postgresql://<user>:<password>@<direct-host>/<db>?sslmode=require'

# Secret for signing JWT session tokens (generate with: openssl rand -hex 32)
SESSION_SECRET='your-secret-here'
```

> If you are using [Neon](https://neon.tech), the pooler host ends in `-pooler` and the direct host does not.

### 3. Push the schema to the database

```bash
npx prisma db push
```

This creates the `users` and `words` tables and generates the Prisma Client.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  (auth)/           # Login & signup pages
  (main)/           # Main app (home / flashcard view)
  actions/
    auth.ts         # signup / login / logout server actions
    words.ts        # addWord / getWords server actions
  lib/
    definitions.ts  # Zod schemas & TypeScript types
    session.ts      # JWT session helpers
components/
  AddWordModal.tsx  # Floating + button → modal to add a word
  FlashCard.tsx     # Swiper-based flashcard deck
  Meteors.tsx       # Animated meteor background
  navBar.tsx        # Responsive navigation bar
lib/
  prisma.ts         # PrismaClient singleton (with PrismaNeon adapter)
  utils.ts          # Tailwind class merge helper
prisma/
  schema.prisma     # User + Word models
prisma.config.ts    # Prisma CLI datasource config (required by Prisma v7)
proxy.ts            # Middleware: redirect unauthenticated users to /login
```

---

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  words     Word[]
}

model Word {
  id        Int      @id @default(autoincrement())
  word      String
  details   String?
  userId    Int
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## Useful Commands

| Command               | Description                               |
| --------------------- | ----------------------------------------- |
| `npm run dev`         | Start development server                  |
| `npm run build`       | Production build                          |
| `npm run lint`        | Run ESLint                                |
| `npx prisma db push`  | Sync schema to database & generate client |
| `npx prisma generate` | Regenerate Prisma Client only             |
| `npx prisma studio`   | Open Prisma Studio (database GUI)         |

---

## Notes on Prisma v7

Prisma 7 **removed the Rust query engine** and requires a driver adapter. This project uses `PrismaNeon` from `@prisma/adapter-neon`. Key differences from older Prisma versions:

- `url` / `directUrl` are **no longer in `schema.prisma`** — they live in `prisma.config.ts`
- The `PrismaClient` constructor **must receive an `adapter`** instance
- `prisma.config.ts` is required for all CLI commands (`db push`, `migrate`, `generate`, etc.)
