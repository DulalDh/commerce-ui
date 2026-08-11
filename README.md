# Commerge Frontend

Frontend for a multi-tenant SaaS marketplace platform — three Vue 3 apps (storefront, tenant admin, super admin) in an Nx monorepo, consuming the [Commerge backend API](../Projects/docs/postman/marketplace-api.postman_collection.json) (Laravel, frozen at v1.0.0).

Built phase-by-phase per `Frontend-Development-Plan.md`. All 5 phases (Foundation → Product Marketplace → Platform Layer → Service Marketplace → Reports/Notifications/CMS → Hardening) are complete.

## Tools & Technology

| Layer | Choice |
|---|---|
| Framework | Vue 3 (`<script setup>`, Composition API) |
| Language | TypeScript |
| Monorepo | Nx 23 (npm workspaces) |
| Build tool | Vite 8 (rolldown-vite) |
| CSS | Tailwind CSS v4 |
| Client state | Pinia |
| HTTP | Axios, with a single interceptor-driven client |
| Routing | Vue Router 4 |
| E2E testing | Playwright (`@nx/playwright`) |
| Unit testing | Vitest |

## Apps

| App | Port (dev) | Who uses it |
|---|---|---|
| `tenant-admin` | 4200 | Merchant / service-provider admin dashboard |
| `super-admin` | 4201 | Platform super admin |
| `storefront` | 4202 | End customers (public) |

Each app is routing + layout composition only; all real UI and data-fetching logic lives in `apps/<app>/src/views/*` composed from the shared libs below.

## Shared libraries (`libs/shared/*`)

| Lib | Package | What it is |
|---|---|---|
| `ui` | `@org/ui` | Design system — atoms (TextInput, Select, DatePicker, …) and molecules (Button, Card, Modal, SidePanel, Table, ImageUpload, BarChart, …) built with Tailwind, dark-mode aware, keyboard/aria accessible |
| `theme` | `@org/theme` | `theme.js` design tokens (single source of truth, mirrored into Tailwind's `@theme` CSS block) + `useTheme()` light/dark composable |
| `api-client` | `@org/api-client` | One axios instance with request/response interceptors (auth token, tenant header, envelope unwrap, 401 → refresh-token retry) + a typed service file per backend module (21 modules) |
| `types` | `@org/types` | TypeScript interfaces per backend module, consumed by `api-client`'s typed services |
| `auth` | `@org/auth` | Pinia auth store, route guard, `usePermission()` composable |
| `config` | `@org/config` | One `menu.json` per app + `filterMenu()` (tenant-type / permission aware) |
| `utils` | `@org/utils` | Cross-cutting helpers (e.g. `normalizeChartData` for report responses) |

## Getting started

```bash
npm install
```

Each app reads its API base URL from `apps/<app>/.env` (`VITE_API_BASE_URL`, defaults to `http://localhost:8000/api` — point it at a running instance of the Commerge backend).

### Run an app

```bash
npx nx serve tenant-admin     # http://localhost:4200
npx nx serve super-admin      # http://localhost:4201
npx nx serve storefront       # http://localhost:4202
```

### Build

```bash
npx nx build tenant-admin           # single app
npx nx run-many -t build            # everything (apps + libs)
```

### Sync TS project references

Run after adding/removing cross-project imports, or whenever Nx reports the workspace as "out of sync":

```bash
npx nx sync
```

### E2E tests (Playwright)

```bash
npx playwright test --config=apps/tenant-admin/playwright.config.mts
npx playwright test --config=apps/super-admin/playwright.config.mts
npx playwright test --config=apps/storefront/playwright.config.mts
```

Current suites are smoke tests for the auth screens (login/register rendering, unauthenticated redirect) — they run against a plain `vite` dev server and don't require the backend to be up.

### Useful Nx commands

```bash
npx nx graph                  # visualize the project/dependency graph
npx nx show project ui        # inspect a project's targets
npx nx reset                  # clear the Nx cache (use if a build looks stale)
```

## Project structure

```
apps/
  tenant-admin/   super-admin/   storefront/
    src/
      app/         # App.vue / AppShell.vue, NotificationBell, CartDrawer (storefront only)
      views/       # one folder per feature (catalog, orders, bookings, cms, …)
      router/
      stores/      # app-local Pinia stores (e.g. storefront's cart)
      main.ts
    e2e/           # Playwright specs
    .env

libs/shared/
  ui/  theme/  api-client/  types/  auth/  config/  utils/
```

## Conventions

- **Atomic design** inside `@org/ui`: `atoms/` are thin styled wrappers around a single form control; `molecules/` compose atoms (never duplicate an atom's markup).
- **Views own their data fetching.** Every view that calls the API keeps `loading` / `error` refs and shows them in the template — there's no shared data-fetching abstraction (see Known limitations).
- **Services, not raw axios, in views.** All HTTP calls go through `@org/api-client`'s per-module service objects (`productsService`, `bookingsService`, …), never `axios` directly.
- **Tenant identity never comes from the URL.** The `X-Tenant-ID` header is set once from the authenticated user's `tenant_id` at login and cleared on logout — no view reads a tenant id from route params or query strings.
- **Menus are data, not markup.** Nav items live in `@org/config`'s `menu.json` files, filtered at render time by tenant type / permission — never hardcoded in a component.

## Known limitations / deviations from the original plan

- **`@tanstack/vue-query` is installed but unused.** Views fetch data with a plain `ref` + `onMounted` + try/catch/finally pattern instead. Adopting Vue Query for caching/refetching is a reasonable follow-up but would touch most views.
- **No OpenAPI spec.** `@org/types` is hand-written from the Postman collection's example bodies (the plan's documented fallback) rather than generated — it will drift if the backend API changes without a corresponding frontend update.
- **RBAC on the storefront is coarse.** `usePermission().can()` exists but most storefront nav items don't set a `permission` — customer-level permission granularity wasn't part of the backend's RBAC model (that's roles/permissions for admin users, not customers).
- **Playwright coverage is smoke-level only**, covering unauthenticated auth screens. Full user-journey e2e (login → checkout, login → booking lifecycle) needs a running backend and seeded test data, which wasn't available in this environment.
- **No visual/manual QA against a live backend.** All builds were verified with `nx build`/`nx run-many -t build` and Playwright smoke tests against static dev servers; no requests were exercised against a real Laravel instance during development.
