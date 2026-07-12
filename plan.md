# TransitOps Frontend — Build Tasks

Frontend-only. Stack: **React + Vite, React Router, Axios, Tailwind CSS, shadcn/ui-style components, React Toastify, Chart.js (if time remains)**. Plain JavaScript (`.jsx`), no TypeScript.

Mock data lives behind a toggle so the app is fully clickable today and switches to real API calls later with no component changes.

Work through tasks **in order**. Each task lists exact files and a "done when" check. Don't skip ahead — later tasks assume earlier ones exist.

---

## Ground Rules (apply to every task)

- No comments that just restate the code (`// set loading to true`). Comment only non-obvious logic.
- Name things the way a person would: `VehicleTable`, not `VehicleTableComponentV2`. No `handleClick2`, no leftover `TODO: fix later` unless it's a real, tracked gap.
- Mock data must look real: plausible names, staggered dates, realistic numbers (odometers in the thousands, not `100`/`200`/`300` repeating). No "Test User", "Lorem Ipsum", "asdf".
- Every list/table needs an empty state ("No vehicles yet — add your first one") and a loading state — never a blank white box.
- Consistent spacing/sizing — pick a scale (e.g. Tailwind's default) and stick to it; don't mix arbitrary pixel values with Tailwind classes.
- Icons: use `lucide-react` throughout instead of emoji, except where emoji are explicitly part of sidebar copy in the spec (we'll translate those to icon components instead — cleaner and more consistent than emoji in production UI).

---

## Task 0 — Project Setup

**Files:** project root

1. `npm create vite@latest transitops-frontend -- --template react`
2. Install: `react-router-dom axios react-toastify lucide-react chart.js react-chartjs-2 clsx`
3. Install Tailwind: `tailwindcss postcss autoprefixer` (or the current Vite Tailwind plugin path) + init config
4. Install a shadcn-style setup: run `shadcn` init (or manually add `class-variance-authority`, `tailwind-merge`, `@radix-ui/react-*` primitives as needed per component) — components land in `src/components/ui/`
5. Create folder scaffold exactly:
```
src/
├── assets/
├── components/
│   ├── ui/            (shadcn-style primitives: button, card, dialog, input, table, badge, select, tabs)
│   ├── common/
│   ├── dashboard/
│   ├── vehicle/
│   ├── driver/
│   ├── trip/
│   ├── maintenance/
│   └── reports/
├── pages/
│   ├── public/
│   ├── admin/
│   ├── driver/
│   ├── safety/
│   └── finance/
├── services/
├── context/
├── hooks/
├── utils/
├── mocks/
├── App.jsx
└── main.jsx
```
6. Set up path alias `@/` → `src/` in `vite.config.js` and `jsconfig.json`

**Done when:** `npm run dev` runs a blank Vite+React+Tailwind app with no console errors, and importing from `@/components/...` works.

---

## Task 1 — Design Tokens & Base Styles

**Files:** `tailwind.config.js`, `src/index.css`

1. Define a real color palette in Tailwind config (not default blue-500 everywhere) — pick a primary (e.g. deep indigo/slate blue for a "transport ops" feel), a neutral gray scale, and semantic colors: success (green), warning (amber), danger (red), info (sky).
2. Set base font (Inter or system-ui stack), base radius (e.g. `--radius: 0.5rem`), consistent shadow scale.
3. Add dark-mode capable CSS variables even if dark mode itself is a stretch goal — costs nothing now, saves pain later.

**Done when:** a test page shows the palette swatches and they look intentional, not default-Tailwind.

---

## Task 2 — Mock Data Layer + Toggle

**Files:** `src/mocks/*.js`, `src/utils/config.js`

1. `src/utils/config.js` — exports `USE_MOCK_DATA` read from `import.meta.env.VITE_USE_MOCK` (default `true`).
2. Create realistic mock datasets, each 15–25 records:
   - `mocks/vehicles.js` — registration numbers like `MH-12-AB-4521`, mixed statuses (Available/On Trip/In Shop/Retired), varied types (Van/Truck/Mini-Truck), capacities 300–2000 kg, odometers 8,000–145,000 km, acquisition costs realistic for vehicle type.
   - `mocks/drivers.js` — real-sounding names, license numbers, license categories (LMV/HMV), expiry dates spread across past/near/far future (so expired + expiring-soon + valid all appear), safety scores 60–99, statuses (Available/On Trip/Off Duty/Suspended).
   - `mocks/trips.js` — sources/destinations as real city pairs, linked vehicleId/driverId, cargo weights under each vehicle's capacity, distances, statuses across the full lifecycle (Draft/Dispatched/Completed/Cancelled), dates over the last ~60 days.
   - `mocks/maintenance.js` — linked to vehicles, types (Oil Change, Tire Replacement, Brake Service, General Inspection), costs, open/closed records.
   - `mocks/expenses.js` — fuel logs (liters, cost, date, linked vehicle) and toll/misc expenses.
   - `mocks/users.js` — one seed user per role: Fleet Manager, Driver, Safety Officer, Financial Analyst, with email/password for the login form.
3. `src/utils/delay.js` — small helper `simulateDelay(ms = 400)` so mock service calls feel like real network calls (no instant-snap UI).

**Done when:** importing any mock file gives an array of realistic, varied records; `USE_MOCK_DATA` flips cleanly via `.env`.

---

## Task 3 — Services Layer (mock-first, API-ready)

**Files:** `src/services/api.js`, `src/services/*Service.js`

1. `api.js` — Axios instance with `baseURL` from `VITE_API_BASE_URL`, request interceptor attaching `Authorization` from stored token, response interceptor handling 401 → logout.
2. Each service (`authService`, `vehicleService`, `driverService`, `tripService`, `maintenanceService`, `dashboardService`, `reportService`) exports the **same function signatures** regardless of mock/real mode, e.g.:
```js
// vehicleService.js
export async function getVehicles(filters) {
  if (USE_MOCK_DATA) {
    await simulateDelay();
    return filterMockVehicles(filters);
  }
  const { data } = await api.get('/vehicles', { params: filters });
  return data;
}
```
3. Mock branch does real filtering/sorting/pagination logic against the in-memory mock array (not just returning the whole array) — this is what makes filters/search actually work in the demo.
4. `authService.login(email, password)` checks against `mocks/users.js` in mock mode, returns `{ user, token }`.

**Done when:** every page can call a service function and get back correctly filtered/shaped data, with zero knowledge of whether it's mock or real.

---

## Task 4 — Auth Context & Route Protection

**Files:** `src/context/AuthContext.jsx`, `src/components/common/PrivateRoute.jsx`

1. `AuthContext` — provides `user`, `role`, `login()`, `logout()`, `isAuthenticated`. Persists token + user to `localStorage`, rehydrates on load.
2. `PrivateRoute.jsx` — wraps a route, redirects to `/login` if unauthenticated, redirects to the user's own dashboard (not a blank "unauthorized" page) if role doesn't match the route's allowed roles.
3. `useAuth()` hook in `src/hooks/useAuth.js` wrapping the context.

**Done when:** visiting `/admin/dashboard` while logged out redirects to `/login`; logging in as a Driver and visiting `/admin/vehicles` redirects to `/driver/dashboard`.

---

## Task 5 — Shared Components

**Files:** `src/components/common/*`

1. `Navbar.jsx` — logo/name left, user menu right (avatar initials, name, role badge, logout).
2. `Sidebar.jsx` — takes a `items` prop (icon + label + path), highlights active route, collapsible on mobile. Role-specific item lists are passed in from `DashboardLayout`, not hardcoded here.
3. `Footer.jsx` — minimal, only used on the public Landing page.
4. `Loading.jsx` — a real skeleton/spinner component, reusable inline or full-page.
5. `ConfirmDialog.jsx` — shadcn-style dialog for destructive actions ("Delete vehicle MH-12-AB-4521? This can't be undone.") — reused by every delete/suspend action, not rebuilt per feature.
6. `EmptyState.jsx` — icon + message + optional action button, used across all tables/lists.

**Done when:** each component renders standalone with sample props and looks finished, not a wireframe.

---

## Task 6 — DashboardLayout (the one reusable layout)

**Files:** `src/components/dashboard/DashboardLayout.jsx`, `src/utils/roleConfig.js`

1. `roleConfig.js` — single source of truth mapping each role to its sidebar items and allowed routes:
```js
export const ROLE_CONFIG = {
  FLEET_MANAGER: {
    label: 'Fleet Manager',
    sidebar: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
      { label: 'Vehicles', path: '/admin/vehicles', icon: 'Truck' },
      { label: 'Drivers', path: '/admin/drivers', icon: 'Users' },
      { label: 'Trips', path: '/admin/trips', icon: 'Route' },
      { label: 'Maintenance', path: '/admin/maintenance', icon: 'Wrench' },
      { label: 'Reports', path: '/admin/reports', icon: 'BarChart3' },
      { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
    ],
  },
  DRIVER: {
    label: 'Driver',
    sidebar: [
      { label: 'Dashboard', path: '/driver/dashboard', icon: 'LayoutDashboard' },
      { label: 'My Trips', path: '/driver/trips', icon: 'Route' },
    ],
  },
  SAFETY_OFFICER: {
    label: 'Safety Officer',
    sidebar: [
      { label: 'Dashboard', path: '/safety/dashboard', icon: 'LayoutDashboard' },
      { label: 'Driver Safety', path: '/safety/drivers', icon: 'ShieldCheck' },
    ],
  },
  FINANCIAL_ANALYST: {
    label: 'Financial Analyst',
    sidebar: [
      { label: 'Dashboard', path: '/finance/dashboard', icon: 'LayoutDashboard' },
      { label: 'Reports', path: '/finance/reports', icon: 'BarChart3' },
    ],
  },
};
```
2. `DashboardLayout.jsx` — reads current user's role from `useAuth()`, pulls `ROLE_CONFIG[role]`, renders `Navbar` + `Sidebar` (with that role's items) + `<Outlet />` for the page content.

**Done when:** the same `DashboardLayout` renders correctly for all 4 roles, sidebar contents change per role, nothing is duplicated.

---

## Task 7 — Public Pages

**Files:** `src/pages/public/LandingPage.jsx`, `src/pages/public/LoginPage.jsx`

### LandingPage (`/`)
Sections: Navbar (public version, just Login button) → Hero (headline + subtext + "Login" CTA) → About TransitOps (short, real-sounding copy about the problem it solves) → Features (grid of ~6 feature cards pulled from the spec: fleet tracking, driver compliance, trip dispatch, maintenance logs, expense tracking, analytics) → Tech Stack (small badge row) → Footer.

### LoginPage (`/login`)
- Email + password fields, single "Login" button, no signup link (per spec — this is an internal ops tool).
- Below the form (dev convenience only, remove before real deployment): small "quick login as..." row with the 4 seeded mock users, visible only when `USE_MOCK_DATA` is true.
- On submit: calls `authService.login`, on success routes to the correct dashboard for that role, on failure shows a toast, not an alert().

**Done when:** landing page looks like a real product marketing page (not 3 headings and a button), login works for all 4 seeded users and routes correctly.

---

## Task 8 — Fleet Manager Pages (`/admin/*`)

**Files:** `src/pages/admin/*.jsx`, plus components in `src/components/{vehicle,driver,trip,maintenance,reports}/`

### 8.1 Dashboard (`/admin/dashboard`)
- Cards: Total Vehicles, Available Vehicles, Active Trips, Maintenance (count in shop), Drivers (total or on-duty — pick one and label clearly), Fuel Expense (this month).
- Charts (Chart.js, or defer if time-constrained — build cards first): Vehicle Status (pie), Monthly Trips (bar), Fuel Cost (line).
- `RecentTripsTable` — last 5–8 trips, status badges.

### 8.2 Vehicle Management (`/admin/vehicles`)
- `VehicleTable` — sortable columns (Registration, Name, Type, Capacity, Odometer, Status), status badge colors matching spec (Available/On Trip/In Shop/Retired).
- Search box (debounced) + status/type filter dropdowns.
- "Add Vehicle" button → `VehicleFormModal` (create/edit, same modal).
- Row actions: Edit, Delete (behind `ConfirmDialog`).

### 8.3 Driver Management (`/admin/drivers`)
- `DriverTable` — Name, License Number, License Category, Expiry, Safety Score, Status.
- "Add Driver" → `DriverFormModal`. Edit/Delete row actions.
- Expiry date visually flagged if within 30 days (amber) or past (red) — reuses a shared `licenseStatus` util, not duplicated logic.

### 8.4 Trip Management (`/admin/trips`)
- `TripTable` — Source → Destination, Vehicle, Driver, Cargo Weight, Status.
- "Create Trip" → `CreateTripModal`: vehicle dropdown filtered to Available only, driver dropdown filtered to Available + valid license only, cargo weight input validated live against selected vehicle's max capacity (show inline error, disable submit if exceeded).
- Row actions by status: Dispatch (Draft → Dispatched, only shown on Draft rows), Cancel (Draft/Dispatched only), Complete (Dispatched only) → `CompleteTripModal` (ending odometer + fuel consumed).

### 8.5 Maintenance (`/admin/maintenance`)
- `MaintenanceTable` — Vehicle, Type, Start Date, Cost, Status (Open/Closed).
- "Add Maintenance" → `MaintenanceModal` (creating one sets the linked vehicle to "In Shop" in mock data logic).
- "Complete Maintenance" row action closes the record and restores vehicle to Available (unless vehicle is Retired).

### 8.6 Reports (`/admin/reports`)
- Tabs or sections: Expenses, Fuel, Completed Trips — each a table (`ExpenseTable`) with a summary `ReportCard` row above it (totals).
- Date range filter shared across tabs.
- CSV export button (client-side CSV generation from the currently filtered table).

### 8.7 Settings (`/admin/settings`)
- Simple form: Fuel Price (number input), Save button → toast confirmation. Keep this page small and clean, it's minor per spec.

**Done when:** a Fleet Manager can log in and perform every action listed above end-to-end using mock data, with correct validation and toasts, and every table has working search/filter/empty states.

---

## Task 9 — Driver Pages (`/driver/*`)

**Files:** `src/pages/driver/*.jsx`

### 9.1 Dashboard (`/driver/dashboard`)
- Cards: Assigned Vehicle (reg number + type), Today's Trip (source→destination or "No trip assigned today"), Trip Status badge.

### 9.2 My Trips (`/driver/trips`)
- Table/list of trips assigned to the logged-in driver (mock service filters by `driverId` matching current user).
- "View" opens a read-only detail view/modal.
- "Complete Trip" (only on Dispatched trips) opens a popup: Ending Odometer input, Submit → marks trip Completed, driver + vehicle status back to Available.

**Done when:** logging in as the seeded Driver user shows only their own trips, and completing a trip updates status correctly in the mock store.

---

## Task 10 — Safety Officer Pages (`/safety/*`)

**Files:** `src/pages/safety/*.jsx`

### 10.1 Dashboard (`/safety/dashboard`)
- Cards: Total Drivers, Expired Licenses, Expiring Soon (≤30 days), Suspended Drivers — all computed live from mock driver data, not hardcoded numbers.

### 10.2 Driver Safety (`/safety/drivers`)
- Table: Driver, License Expiry, Safety Score, Status.
- Only actions available: Suspend / Activate (behind `ConfirmDialog`) — explicitly no Edit/Delete here, matching the spec's "only safety actions" note.

**Done when:** the expired/expiring counts on the dashboard match what's actually in the table, and suspend/activate updates status live.

---

## Task 11 — Financial Analyst Pages (`/finance/*`)

**Files:** `src/pages/finance/*.jsx`

### 11.1 Dashboard (`/finance/dashboard`)
- Cards: Total Expenses, Fuel Cost, Maintenance Cost, Completed Trips — all computed from mock data totals.

### 11.2 Financial Reports (`/finance/reports`)
- Tables: Fuel Expense, Trip Expense, Maintenance Expense.
- Charts: Fuel Cost Trend (line), Monthly Expense (bar).
- This page can share components with `/admin/reports` (same `ExpenseTable`/`ReportCard`) rather than rebuilding — just scoped to finance-relevant data and read-only (no export/settings actions Fleet Manager gets, unless you want parity).

**Done when:** numbers on the finance dashboard match the report tables below them.

---

## Task 12 — Routing Assembly

**Files:** `src/App.jsx`, `src/main.jsx`

1. Wrap app in `AuthProvider` and `BrowserRouter`.
2. Public routes: `/` (Landing), `/login` (Login).
3. Protected routes, each wrapped in `PrivateRoute` with its allowed role(s), all nested under `DashboardLayout`:
   - `/admin/*` → Fleet Manager only
   - `/driver/*` → Driver only
   - `/safety/*` → Safety Officer only
   - `/finance/*` → Financial Analyst only
4. Catch-all `*` route → redirect to Landing or a simple 404.
5. Mount `<ToastContainer />` once at the app root.

**Done when:** the full route tree from the spec works, matches the "Total Pages" table exactly (14 protected pages + Landing + Login), and no role can reach another role's pages via direct URL entry.

---

## Task 13 — Polish Pass

1. Responsive check at 375px / 768px / 1280px for every page — sidebar collapses to a drawer/hamburger on mobile.
2. Every table has: loading skeleton, empty state, and (where relevant) pagination if mock data list is long.
3. Consistent status badge component (`<StatusBadge status="Available" />`) used everywhere instead of one-off colored spans.
4. Consistent date formatting utility used everywhere (no mixed `MM/DD/YYYY` vs `DD-MM-YYYY`).
5. Run through as each of the 4 seeded users once, end to end, and fix anything that feels rough.

**Done when:** the app feels like one coherent product, not four separately-built sections stitched together.

---

## Reference: Full Page List (for tracking)

| # | Page | Route | Role |
|---|------|-------|------|
| 1 | Landing | `/` | Public |
| 2 | Login | `/login` | Public |
| 3 | Admin Dashboard | `/admin/dashboard` | Fleet Manager |
| 4 | Vehicles | `/admin/vehicles` | Fleet Manager |
| 5 | Drivers | `/admin/drivers` | Fleet Manager |
| 6 | Trips | `/admin/trips` | Fleet Manager |
| 7 | Maintenance | `/admin/maintenance` | Fleet Manager |
| 8 | Reports | `/admin/reports` | Fleet Manager |
| 9 | Settings | `/admin/settings` | Fleet Manager |
| 10 | Driver Dashboard | `/driver/dashboard` | Driver |
| 11 | My Trips | `/driver/trips` | Driver |
| 12 | Safety Dashboard | `/safety/dashboard` | Safety Officer |
| 13 | Driver Safety | `/safety/drivers` | Safety Officer |
| 14 | Finance Dashboard | `/finance/dashboard` | Financial Analyst |
| 15 | Financial Reports | `/finance/reports` | Financial Analyst |

---

## Env Reference

```env
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:8080/api
```

Flip `VITE_USE_MOCK=false` once the backend is ready — no component code should need to change, only the services layer's internal branch.