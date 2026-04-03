# Livinexo — Modern Household Management App

A modern web application for household members to collaboratively track and manage shared expenses.

## Features

- **Member Management** — Add, edit, and remove household members
- **Expense Tracking** — Log items with name, quantity, price, date/time, category, and notes
- **Shared Bucket System** — All expenses go to a common pool with configurable member splits
- **Equal Expense Splitting** — Automatically split costs among selected members
- **Settlement Tracking** — Mark individual splits as settled with one click
- **Analytics Dashboard** — Monthly spending trends, category breakdowns, per-member comparisons, top items
- **Filtering & Pagination** — Filter expenses by category or member with paginated results

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** with custom Livinexo design system
- **Prisma ORM** with SQLite
- **Recharts** for analytics visualizations
- **Lucide Icons**

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Database Setup

```bash
npx prisma migrate dev    # Run migrations
npx prisma db seed        # Seed with sample data
```

### Development

```bash
npm run dev               # Starts on http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/                  # API routes
│   │   ├── analytics/        # GET analytics data
│   │   ├── expenses/         # CRUD expenses + settlement
│   │   └── members/          # CRUD members
│   ├── analytics/            # Analytics page with charts
│   ├── dashboard/            # Dashboard overview
│   ├── expenses/             # Expense list + add new
│   └── members/              # Member management
├── components/
│   ├── charts/               # Recharts components
│   ├── layout/               # Sidebar navigation
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   └── utils.ts              # Utility functions
└── types/                    # TypeScript interfaces
prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Sample data seed
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:reset` | Reset database and re-seed |
# livinexo-frontend
