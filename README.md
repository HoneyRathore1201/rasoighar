# RasoiGhar

A full-stack recipe management and smart cooking web application built for Indian cuisine. Store recipes, track pantry ingredients, and discover what dishes you can cook with what you have.

## Features

- **Recipe Box** — Full CRUD for recipes with search, tags, and filtering
- **Fridge Tracker** — Manage your pantry inventory by category
- **Smart Matching** — Find recipes you can make with available ingredients
- **Recipe Generator** — Create recipes from your ingredient list
- **Meal Planner** — Plan your weekly meals on a calendar grid
- **Voice Input** — Add ingredients using speech recognition
- **15+ Pre-loaded Recipes** — Authentic Indian dishes ready to use
- **85+ Ingredients** — Categorized with Hindi aliases

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | MongoDB (Mongoose) |
| Auth | NextAuth.js v5 |
| State | Zustand |
| Animations | Framer Motion |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and auth secret

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and create an account. Sample recipes are seeded automatically.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `AUTH_SECRET` | Yes | Random secret for NextAuth |
| `GEMINI_API_KEY` | No | Enables recipe generator |
| `GOOGLE_CLIENT_ID` | No | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth |

## Project Structure

```
src/
├── app/           # Pages and API routes
├── components/    # Reusable UI components
├── data/          # Seed data (recipes, ingredients)
├── hooks/         # Custom React hooks
├── lib/           # Core utilities
├── models/        # Mongoose schemas
├── store/         # Zustand state stores
└── types/         # TypeScript interfaces
```

## License

MIT
