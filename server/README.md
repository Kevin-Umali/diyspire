# Make Me Project - Server

Backend service for the DIY Project platform. Provides an API that interacts with OpenAI to fetch DIY project details and suggestions.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. Navigate to the server directory:

```bash
cd server
```

2. Install the dependencies:

```bash
npm install
```

3. Set up your environment variables:

> Copy the `.env.example` file and create a new `.env` file with your own settings.

### Running the Server

For development:

```bash
npm run watch:dev
```

For production:

```bash
npm run start
```

### Database Setup (Prisma)

This project uses Prisma as an ORM to interact with the database. Follow these steps to set up and seed the database:

1. Ensure you have PostgreSQL installed and running on your system.

2. Apply database migrations to create the schema:

```bash
npx prisma migrate dev --name init
```

2.1. If there's already a migration file use this to sync:

```bash
npx prisma db push
```

3. If seed doesn't automatically run, it will seed the database with initial data

```bash
npx prisma db seed
# or
npx prisma migrate reset
```

4. Deploy in the production

```bash
npx prisma migrate dev --create-only
npx prisma migrate deploy
```

This sets up the database schema and populates it with initial data, allowing your server to interact with the database using Prisma.
