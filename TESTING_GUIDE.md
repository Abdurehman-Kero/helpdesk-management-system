# Helpdesk Management System — Complete Testing & Operations Guide

This document is your step-by-step walkthrough to start, run, and test every requirement, role, and workflow in the Helpdesk Management System.

---

## 1. Compliance Matrix

| Requirement | Implementation | Status |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | ✅ Compliant |
| **Language** | TypeScript (Strict mode) | ✅ Compliant |
| **ORM** | Prisma (PostgreSQL / SQLite dev fallback) | ✅ Compliant |
| **Form Handling** | React Hook Form (`LoginForm`, `RegisterForm`, `TicketForm`) | ✅ Compliant |
| **Validation** | Zod shared schemas (`auth.schema.ts`, `ticket.schema.ts`) | ✅ Compliant |
| **Styling** | Tailwind CSS (Information-dense B2B aesthetic) | ✅ Compliant |
| **Authentication** | JWT stored in `httpOnly` cookies (`lib/auth.ts`) | ✅ Compliant |
| **No API Routes** | 100% Server Actions (`auth.actions.ts`, `ticket.actions.ts`) | ✅ Compliant |
| **Server vs Client** | Server Components for data fetching, `"use client"` only for forms/filters | ✅ Compliant |
| **Shared Validation** | Zod schemas imported by client forms & server actions | ✅ Compliant |
| **Deliverables** | Auth, RBAC, Ticket CRUD & Workflow, Dashboard, Filtering, Activity Timeline, Seed Script | ✅ Compliant |

---

## 2. Preseeded Accounts

All accounts use the password: **`password123`**

| Role | Email | Name | Default Responsibilities |
| :--- | :--- | :--- | :--- |
| **Manager** | `manager1@company.com` | Manager One | Assigns tickets, changes priority, manager overrides |
| **Manager** | `manager2@company.com` | Manager Two | Full system oversight |
| **Technical Staff** | `tech1@company.com` | Tech One | Handles assigned tickets (`ASSIGNED` &rarr; `IN_PROGRESS` &rarr; `RESOLVED`) |
| **Technical Staff** | `tech2@company.com` | Tech Two | Technical resolution & comments |
| **Technical Staff** | `tech3@company.com` | Tech Three | Technical resolution & comments |
| **Employee** | `emp1@company.com` | Employee One | Submits tickets, tracks status, closes resolved tickets |
| **Employee** | `emp2@company.com` | Employee Two | Submits & tracks own tickets |
| **Employee** | `emp3@company.com` | Employee Three | Submits & tracks own tickets |

---

## 3. Quick Start Commands

Run these terminal commands inside `helpdesk-management-system/`:

```bash
# 1. Install project dependencies
npm install

# 2. Push database schema
npx prisma db push

# 3. Seed database with 8 users & 12 realistic tickets with full timeline history
npx tsx prisma/seed.ts

# 4. Start local development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 4. End-to-End System Testing Flow

Follow these 5 testing steps to walk through the complete ticket lifecycle and verify all RBAC constraints:

---

### Step 1: Employee Ticket Creation & Scope Test
1. Go to `http://localhost:3000/login` and log in as:
   - **Email**: `emp1@company.com`
   - **Password**: `password123`
2. You will be redirected to `/dashboard`. Notice:
   - Stats display only tickets created by Employee One.
   - The navigation bar includes **New Ticket**.
3. Click **Create New Ticket** or navigate to `/tickets/new`.
4. Fill out the form:
   - **Title**: `Dual monitor flickering on desk 12`
   - **Category**: `IT Support`
   - **Urgency / Priority**: `High`
   - **Description**: `Secondary monitor flashes black every few minutes. Cables re-seated but issue persists.`
5. Click **Submit Ticket**.
6. You will be redirected to `/tickets/[id]`. Verify:
   - Ticket number auto-generated (e.g. `TKT-013`).
   - Status badge is `OPEN`.
   - Timeline records `STATUS_CHANGE` ("Ticket created").

---

### Step 2: Manager Oversight & Assignment
1. Log out and log back in as Manager:
   - **Email**: `manager1@company.com`
   - **Password**: `password123`
2. View `/dashboard`. Notice:
   - Dashboard stats reflect **all company tickets** (Total, Open, Assigned, In Progress, Resolved, Closed).
3. Navigate to `/tickets`.
4. Use the filter bar to select **Status: Open**.
5. Click on `TKT-013` (or the ticket created in Step 1).
6. In the **Manager Administrative Controls** card:
   - Select `Tech One` from the technical staff dropdown and click **Assign**.
   - Status updates automatically to `ASSIGNED`.
   - Timeline logs `ASSIGNMENT` ("Assigned to Tech One").
   - Change Priority to `CRITICAL`.
   - Timeline logs `PRIORITY_CHANGE` ("Priority changed from HIGH to CRITICAL").

---

### Step 3: Technical Staff Resolution Workflow
1. Log out and log back in as Technical Staff:
   - **Email**: `tech1@company.com`
   - **Password**: `password123`
2. Navigate to `/tickets`. Notice the list is automatically filtered to tickets assigned to Tech One.
3. Open `TKT-013`.
4. Click the **Start Work (In Progress)** button.
   - Status updates to `IN_PROGRESS`.
   - Timeline logs `STATUS_CHANGE`.
5. Under **Add Note or Comment**, type:
   - `Replaced DisplayPort cable and updated GPU driver.`
   - Click **Post Comment**.
6. Click the **Mark Resolved** button.
   - Status updates to `RESOLVED`.
   - Timeline logs `STATUS_CHANGE` and displays the comment note.

---

### Step 4: Employee Confirmation & Ticket Closure
1. Log out and log back in as the original creator:
   - **Email**: `emp1@company.com`
   - **Password**: `password123`
2. Navigate to `/tickets` and open `TKT-013`.
3. Review the technical staff comment and verified resolution.
4. Click **Confirm & Close Ticket**.
5. Verify status updates to `CLOSED`.

---

### Step 5: RBAC Boundary & Security Verification
1. Log out and log in as another technical staff member:
   - **Email**: `tech2@company.com`
   - **Password**: `password123`
2. Attempt to open `TKT-013` directly via URL (e.g. `http://localhost:3000/tickets/<ticket-id>`).
3. Verify that `tech2` cannot see action buttons (Start Work / Mark Resolved) for tickets assigned to `tech1`.
4. Attempt to submit a ticket — notice `tech2` does not have access to ticket creation forms.

---

## 5. Verification Checklist

- [x] JWT `httpOnly` cookie session management.
- [x] 3-layer RBAC (Middleware, Page/Component, Server Action).
- [x] Shared Zod schemas for client form validation and server mutation parsing.
- [x] Zero API routes (100% Server Actions with `revalidatePath`).
- [x] B2B restrained UI aesthetic with text-forward status badges and tables.
- [x] Single-table `TicketActivity` timeline audit log.
- [x] Seed script generating 8 users & 12 tickets across all statuses/priorities/categories.
