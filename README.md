# Role-Based Helpdesk Management System

A full-stack, mobile-responsive internal ticketing platform built with Next.js 16 (App Router), TypeScript, Prisma ORM, Server Actions, React Hook Form, Zod, and Tailwind CSS.

---

## Key Technical Features

- **3-Layer Role-Based Access Control (RBAC)**:
  1. **Edge Middleware (`middleware.ts`)**: Protects private app routes using signed JWT session cookies.
  2. **Page & Component Layer**: Renders UI controls conditionally based on user role (Manager, Technical Staff, Employee).
  3. **Server Actions (`actions/*.actions.ts`)**: Enforces authentication & role permissions before performing database mutations.
- **Workflow State Machine**:
  - `OPEN` &rarr; `ASSIGNED` (Manager assignment)
  - `ASSIGNED` &rarr; `IN_PROGRESS` (Assigned Technical staff or Manager)
  - `IN_PROGRESS` &rarr; `RESOLVED` (Assigned Technical staff or Manager)
  - `RESOLVED` &rarr; `CLOSED` (Ticket Creator Employee or Manager)
  - Manager administrative override capability for any valid status transition.
- **Single-Table Audit Trail**: `TicketActivity` table logs all ticket status changes, staff assignments, priority updates, and comments into a unified timeline view.
- **Mobile-First Responsive Design**: Includes responsive mobile navigation drawer, touch-friendly form inputs, and stacked card views for small screens.

---

## Preseeded Test Accounts

All preseeded accounts use the password: **`password123`**

| Role | Email | Name | Default Responsibilities |
| :--- | :--- | :--- | :--- |
| **Manager** | `manager1@company.com` | Manager One | Staff assignment, priority changes, status overrides |
| **Manager** | `manager2@company.com` | Manager Two | Full administrative system oversight |
| **Technical Staff** | `tech1@company.com` | Tech One | Technical resolution (`ASSIGNED` &rarr; `IN_PROGRESS` &rarr; `RESOLVED`) |
| **Technical Staff** | `tech2@company.com` | Tech Two | Technical resolution & activity notes |
| **Technical Staff** | `tech3@company.com` | Tech Three | Technical resolution & activity notes |
| **Employee** | `emp1@company.com` | Employee One | Ticket submission, status tracking, resolution confirmation |
| **Employee** | `emp2@company.com` | Employee Two | Submits & tracks own tickets |
| **Employee** | `emp3@company.com` | Employee Three | Submits & tracks own tickets |

---

## Setup & Running Instructions

### 1. Installation & Environment
```bash
# Clone the repository
git clone <repository-url>
cd helpdesk-management-system

# Fast package installation
npm install --no-audit --no-fund --prefer-offline

# Environment file setup
cp .env.example .env
```
*(By default, `.env` configures a local zero-dependency SQLite database file at `file:./dev.db`)*

### 2. Database Creation & Seeding Script
To generate the Prisma Client, create database tables, and run the preseeded data script:

```bash
# Sync database schema
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Execute seeding script (Seeds 8 users and 12 tickets with complete timeline history)
npx tsx prisma/seed.ts
```

### 3. Development Server
```bash
# Start Next.js development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser and log in with any test account listed above.

---

## Project Structure

```
helpdesk-management-system/
├── actions/                  # "use server" Server Actions (Auth & Ticket operations)
│   ├── auth.actions.ts       # Registration, Login, Logout actions
│   └── ticket.actions.ts     # Ticket creation, assignment, status, priority & comments
├── app/
│   ├── dashboard/            # Operational dashboard page with metric cards
│   ├── login/                # Sign-in page with test accounts helper
│   ├── register/             # Account registration page
│   ├── tickets/
│   │   ├── page.tsx          # Ticket list page (Mobile cards + Desktop table)
│   │   ├── new/page.tsx      # Employee ticket submission form
│   │   └── [id]/page.tsx     # Ticket details, status controls & activity timeline
│   ├── globals.css           # Global B2B CSS design system
│   ├── layout.tsx            # App shell layout with mobile drawer Navbar
│   └── page.tsx              # Root route redirect
├── components/
│   ├── dashboard/            # StatsCards component
│   ├── forms/                # LoginForm, RegisterForm, TicketForm (RHF + Zod)
│   ├── tickets/              # TicketList, TicketFilters, TicketTimeline, StatusActions, CommentBox
│   ├── ui/                   # Reusable UI primitives (Button, Badge, Card)
│   └── Navbar.tsx            # Mobile-first responsive header navigation bar
├── lib/
│   ├── auth.ts               # JWT session creation & cookie verification
│   ├── permissions.ts        # RBAC role checks & allowed status transition rules
│   ├── prisma.ts             # Prisma Client singleton
│   └── validations/          # Shared Zod validation schemas (auth & ticket)
├── prisma/
│   ├── schema.prisma         # Database schema (User, Ticket, TicketActivity)
│   └── seed.ts               # Database seed script (8 users, 12 tickets)
├── middleware.ts             # JWT route protection middleware
├── TESTING_GUIDE.md          # End-to-end interview testing guide
└── README.md                 # Complete documentation & setup instructions
```
