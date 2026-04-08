# RealityQuest

Welcome to the RealityQuest codebase! This application is built with Next.js App Router, Tailwind CSS, shadcn-ui, and Prisma ORM for PostgreSQL.

## Getting Started

### 1. Database Setup with pgAdmin

Before running the application, you need to connect it to your local PostgreSQL instance:

1. Open **pgAdmin**.
2. Right-click on `Databases` > `Create` > `Database...`.
3. Name the database `realityquest` and save it.
4. Copy the connection details (username, password, port).
5. Open the `.env` file in the root of your `reality-quest` project and set the `DATABASE_URL` like so:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/realityquest?schema=public"
```
*(Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your Postgres credentials, often `postgres` for username)*

### 2. Run Database Migrations and Seed

Once the `.env` file is updated, open your terminal in the `reality-quest` folder and run:

```bash
npx prisma db push
```
*(This commands creates the necessary tables in the PostgreSQL database based on the `prisma/schema.prisma` file).*

Then, seed the database with the initial Community Threads by running:

```bash
npx tsx prisma/seed.ts
```

### 3. Run the Development Server

Finally, start your Next.js application:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Test out the Pre-Registration form and browse the seeded Adventurer's Tavern threads!
