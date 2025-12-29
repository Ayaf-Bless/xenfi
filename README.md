# XenFi - Expense Management Dashboard

A modern, full-stack expense management and tracking application built with Next.js, PostgreSQL, and Prisma. Features real-time financial analytics, category-based expense tracking, and a beautiful dark-mode-ready UI.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (we use Neon for serverless PostgreSQL)

### 1. Clone & Install

```bash
git clone <your-repo>
cd xenfi
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database (PostgreSQL - Neon recommended for serverless)
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require&channel_binding=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"

# Application
NODE_ENV="development"
```

**Generate a secure NextAuth secret:**

```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed demo data
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Login with Demo Credentials

```
Email: alex@xenfi.com
Password: password123
```

---

## 📋 Demo Credentials

For testing and demonstration purposes, the database is pre-seeded with:

- **User:** alex@xenfi.com / password123
- **Sample Categories:** Software & SaaS, Travel & Meals, Infrastructure, Office Supplies, Meals
- **Sample Expenses:** 15+ demo transactions across different categories with various statuses

**Note:** These credentials are for development/demo only. In production, users should create their own accounts.

---

## 🏗️ Tech Stack & Rationale

### Frontend

- **Next.js 16** - App Router for modern file-based routing, server components for performance
- **React 19** - Component library with hooks for state management
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS v4** - Utility-first styling, dark mode support out of the box
- **Radix UI** - Unstyled, accessible components (Select, Dialog primitives)
- **Lucide React** - Lightweight, consistent icon library (replaced Material Symbols)

### Backend

- **Next.js API Routes** - Serverless functions for backend operations
- **NextAuth v4** - Battle-tested authentication with Credentials provider and Prisma adapter
- **Prisma ORM v5** - Type-safe database access with auto-generated types
- **Zod** - Runtime validation for API inputs
- **bcryptjs** - Password hashing and security
- **date-fns** - Date manipulation and formatting

### Database

- **PostgreSQL (Neon)** - Serverless PostgreSQL for development flexibility
- **Prisma Migrations** - Version-controlled database schema changes

### DevOps & Tooling

- **Turbopack** - Next.js compiler for fast development iteration
- **ESLint** - Code linting and quality
- **shadcn/ui** - Pre-built, customizable React components

---

## 🎨 Architecture Overview

```
xenfi/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (login)
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/            # KPI overview page
│   │   └── expenses/             # Expense CRUD pages
│   ├── api/                      # Backend API routes
│   │   ├── auth/                 # NextAuth routes
│   │   ├── expenses/             # Expense API endpoints
│   │   ├── categories/           # Category endpoints
│   │   └── dashboard/            # Dashboard stats
│   ├── providers.tsx             # SessionProvider wrapper
│   └── layout.tsx                # Root layout
├── components/ui/                # Reusable UI components
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Prisma client
│   ├── validations.ts            # Zod schemas
│   ├── constants.ts              # App constants
│   └── utils.ts                  # Helper utilities
└── prisma/
    ├── schema.prisma             # Database schema
    └── seed.ts                   # Database seeding
```

---

## 🔑 Key Features

### Authentication

- ✅ Email/password authentication with NextAuth
- ✅ Secure password hashing with bcryptjs
- ✅ JWT-based session management
- ✅ Protected dashboard routes with SessionProvider

### Expense Management

- ✅ Create, read, update, delete (CRUD) operations
- ✅ Category-based organization with colors
- ✅ Payment method tracking
- ✅ Status tracking (pending, approved, rejected)
- ✅ Full-text search and filtering
- ✅ Pagination support (10 items per page)
- ✅ View single expense with full details

### Dashboard Analytics

- ✅ Total expenses summary
- ✅ Monthly expense breakdown by category
- ✅ Recent transactions table
- ✅ Real-time KPI metrics
- ✅ Status distribution tracking

### User Experience

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support with system preference detection
- ✅ Persistent sidebar navigation (always visible during loading)
- ✅ Loading states with spinner indicators
- ✅ Error handling and user feedback
- ✅ Breadcrumb navigation for easy traversal

---

## ⚙️ Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build           # Build for production
npm run start           # Start production server

# Database
npx prisma migrate     # Create and run migrations
npx prisma db seed     # Run seed script
npx prisma studio     # Open Prisma Studio GUI

# Code Quality
npm run lint           # Run ESLint
```

---

## 🔄 API Endpoints

### Authentication

- `POST /api/auth/callback/credentials` - Login with email/password
- `GET /api/auth/session` - Get current user session
- `GET /api/auth/providers` - Get available auth providers

### Expenses

- `GET /api/expenses` - List expenses (paginated, searchable)
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/[id]` - Get single expense details
- `PATCH /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense

### Categories

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PATCH /api/categories/[id]` - Update category

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard metrics and analytics

---

## ⚠️ Known Limitations & Tradeoffs

### Current Limitations

1. **Single User per Session** - Multi-workspace/organization support not implemented
2. **No File Uploads** - Attachment URLs are stored as text only (no actual file storage)
3. **No Bulk Operations** - Expenses must be edited/deleted individually
4. **No Budget Enforcement** - Categories don't enforce spending limits
5. **Limited Export Options** - No PDF/CSV export functionality
6. **No Receipt OCR** - Manual data entry only
7. **No Approval Workflow** - Status is user-controlled, no manager approval flow
8. **No Email Notifications** - No password reset or notification emails

### Technical Tradeoffs

| Feature          | Choice                 | Rationale                                     | Alternative                                          |
| ---------------- | ---------------------- | --------------------------------------------- | ---------------------------------------------------- |
| Auth             | NextAuth + Credentials | Simple, serverless-friendly, no external deps | Auth0, Clerk (adds cost), Firebase (vendor lock-in)  |
| Database         | PostgreSQL             | Reliable, open-source, free tier, SQL         | MongoDB (schema-less but slower), Firebase (cost)    |
| ORM              | Prisma                 | Type-safe, auto-migrations, best DX           | Sequelize, TypeORM (more verbose), raw SQL           |
| Styling          | Tailwind v4            | Utility-first, DX, dark mode, small bundle    | CSS Modules (control), Styled Components (runtime)   |
| State Management | React Hooks            | Sufficient for CRUD app, no boilerplate       | Redux/Zustand (overkill), Jotai (learning curve)     |
| Validation       | Zod                    | Runtime checks, TypeScript integration        | Class-validator (boilerplate), Yup (slower)          |
| Icons            | Lucide React           | Lightweight, tree-shakeable, consistent       | Material Icons (heavier), Font Awesome (bundle size) |

### Performance Considerations

- **Database Queries:** Using Neon's unpooled connection for dev; production should use pooler for connection pooling
- **API Pagination:** Fixed limit of 10 items per page; can optimize with cursor-based pagination for large datasets
- **No Caching:** API responses not cached; could add Redis for frequently accessed stats
- **Image Optimization:** Demo avatars served as-is; production should use Next.js Image component

### Known Issues Fixed

- ✅ Next.js 16+ `params` is now a Promise - fixed by awaiting params in route handlers
- ✅ Material Symbols migration - replaced with lucide-react for consistency
- ✅ SessionProvider wrapper - now wraps entire app for auth context
- ✅ Sidebar visibility during loading - uses LoadingContent component

---

## 🧪 Testing

### Manual Testing Workflow

1. **Login:** Use demo credentials (alex@xenfi.com / password123)
2. **Dashboard:** View KPI metrics and category breakdown
3. **Create Expense:** Click "Add Expense" button, fill form, submit
4. **View Expense:** Click on any expense row to see full details
5. **Edit Expense:** From view page, click "Edit" button
6. **Delete Expense:** Click trash icon with confirmation dialog
7. **Search:** Use search bar to filter by description/merchant
8. **Pagination:** Navigate between pages at bottom of list

### Common Test Scenarios

```
✓ Login with correct credentials → redirects to dashboard
✓ Login with wrong password → shows error message
✓ Create expense with all required fields → success
✓ Create expense missing category → validation error
✓ Edit expense and verify changes → updates correctly
✓ Delete expense with confirmation → removes from list
✓ Search for expense by merchant name → filters results
✓ Navigate pagination → shows correct page
✓ Verify dark mode toggle works → persists preference
✓ View single expense details → all info displays correctly
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Connect to Vercel (first time only)
vercel link

# Deploy
vercel deploy --prod
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate new `NEXTAUTH_SECRET` with `openssl rand -base64 32`
- [ ] Use Neon's pooler connection string for PostgreSQL
- [ ] Enable HTTPS (Vercel default)
- [ ] Set proper CORS headers if needed
- [ ] Configure email service for password reset (optional)
- [ ] Set up monitoring/logging (Sentry, LogRocket)
- [ ] Enable database backups (Neon built-in)
- [ ] Set up custom domain
- [ ] Configure CI/CD pipeline

---

## 📚 Documentation

- [Prisma Docs](https://www.prisma.io/docs/)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod Validation](https://zod.dev/)
- [Lucide Icons](https://lucide.dev/)

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check Prisma status
npx prisma db execute --stdin < /dev/null

# Regenerate Prisma client
npx prisma generate

# Reset database (dev only)
npx prisma migrate reset
```

### NextAuth Not Working

- Verify `NEXTAUTH_SECRET` is set and has 32+ characters
- Check `NEXTAUTH_URL` matches deployment URL (localhost:3000 for dev)
- Clear browser cookies: DevTools → Application → Cookies
- Check terminal for detailed error logs
- Ensure SessionProvider wraps app in layout.tsx

### Styling Issues

- Clear build cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check Tailwind is compiling: look for generated styles
- Verify dark mode toggle in Tailwind config

### Login Issues

- Check user exists in database: `npx prisma studio`
- Verify password is hashed with bcrypt
- Check NextAuth logs in terminal for detailed errors
- Ensure credentials provider is configured correctly

---

## 📝 License

MIT

---

## 👤 Author

Built as a full-stack expense management system demo.

**Last Updated:** December 29, 2025

**Tech Stack Version:**

- Next.js 16.1.1
- React 19
- Prisma 5.18.0
- PostgreSQL (Neon)
- Tailwind CSS 4
