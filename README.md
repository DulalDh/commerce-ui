# Commerge

**A multi-tenant marketplace platform with three purpose-built Vue applications.**

Commerge brings product commerce and service bookings together in one platform. Merchants manage their storefronts, platform operators oversee the marketplace, and customers browse and shop through a public storefront.

> Portfolio demo: this repository contains the frontend monorepo. The apps connect to the Commerge Laravel API; a running backend is needed for live data and authenticated workflows.

## Applications

| App | Local URL | Audience | What it covers |
| --- | --- | --- | --- |
| Tenant Admin | `http://localhost:4200` | Merchants and service providers | Catalog, inventory, orders, bookings, promotions, store settings, and reports |
| Super Admin | `http://localhost:4201` | Platform operators | Merchant oversight, marketplace review, plans, roles and permissions, CMS, and reports |
| Storefront | `http://localhost:4202` | Customers | Public product and service discovery, shopping, and customer flows |

## Highlights

- **Three coordinated applications** in an Nx monorepo, sharing a consistent design system and typed API layer.
- **Multi-tenant request handling** that attaches the authenticated user's tenant identity to API requests.
- **Role and permission-aware navigation** with shared authentication, route guards, and menu configuration.
- **Reusable UI system** with accessible form controls, tables, dialogs, side panels, charts, and light/dark theme support.
- **Product and service workflows**, including catalog management, inventory, orders, bookings, staff, promotions, and marketplace review.
- **Typed API services** organized by backend module, with shared request and response handling.

## Built with

| Area | Technology |
| --- | --- |
| Apps | Vue 3, Vue Router, TypeScript |
| Monorepo | Nx 23, npm workspaces |
| Build and styling | Vite 8, Tailwind CSS 4 |
| State | Pinia |
| API | Axios, shared typed service modules |
| UI verification | Playwright smoke tests, Vitest |

## Architecture

```text
apps/
  tenant-admin/     Merchant and service-provider console
  super-admin/      Platform operations console
  storefront/       Customer-facing marketplace

libs/shared/
  ui/               Reusable components and design system
  theme/            Design tokens and theme composable
  api-client/       Axios client and typed API services
  types/            Shared TypeScript API models
  auth/             Auth store, route guard, permission helper
  config/           App menus and permission-aware filtering
  utils/            Cross-app utilities
```

The apps provide routing and layout composition. Shared behavior and components live in `libs/shared`, while feature screens are organized under each app's `src/views` directory.

## Run locally

### Requirements

- Node.js compatible with the installed dependencies
- npm
- Access to a running Commerge API for live data

Install dependencies from the repository root:

```bash
npm install
```

Each app reads `VITE_API_BASE_URL` from its `apps/<app>/.env` file. It defaults to `http://127.0.0.1:8000/api/v1`; set it to the base URL of your backend API as needed.

Start an app:

```bash
npm exec nx serve @org/tenant-admin
npm exec nx serve @org/super-admin
npm exec nx serve @org/storefront
```

Build an app or all buildable projects:

```bash
npm exec nx build @org/tenant-admin
npm exec nx run-many -t build
```

## Quality checks

The repository includes Playwright smoke coverage for authentication screens and Vitest for unit tests. The current end-to-end specs cover auth screen rendering and unauthenticated redirects; broader user journeys require a running backend and seeded data.

Run the Playwright specs for an app:

```bash
npm exec nx run @org/tenant-admin:e2e
npm exec nx run @org/super-admin:e2e
npm exec nx run @org/storefront:e2e
```

Useful Nx commands:

```bash
npm exec nx graph
npm exec nx show project @org/tenant-admin
npm exec nx sync
```

## Implementation notes

- Feature views call module-specific services from `@org/api-client` instead of using Axios directly.
- Tenant identity is derived from the authenticated user and sent through the `X-Tenant-ID` request header.
- Navigation is defined in shared menu configuration and filtered using tenant type and permissions.
- API types are maintained in `@org/types` from the backend's documented request and response examples.

## Current scope

- API models are maintained by hand, so they need to be updated when the backend contract changes.
- The current E2E suite is smoke-level and does not cover complete checkout or booking journeys.
- Live API behavior depends on a compatible Commerge backend and configured data.

## License

This project is distributed under the MIT License. See [package.json](./package.json) for the repository license metadata.
