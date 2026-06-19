# Subra HMS Portal

Frontend for the Subra Residency hotel management system. The UI is kept in React/Vite, with each portal separated by feature folder so backend API wiring can be added cleanly.

## Project Structure

```txt
src/
  app/
    App.tsx              # Main portal router
    portalDomains.ts    # Domain-to-portal resolver
  assets/               # Images and static visual assets
  components/
    ui/                 # Shared UI primitives
  features/
    admin/              # Admin portal
    customer/           # Public customer website
    reception/          # Reception/front-desk portal
  lib/
    utils.ts            # Shared helpers
  main.tsx              # React entry point
```

## Portal Routing

Local development keeps the existing routes:

```txt
/             Customer portal
/reception    Reception portal
/admin        Admin portal
```

For production, copy `.env.example` to `.env` and set the three domain names:

```txt
VITE_CUSTOMER_DOMAIN=subraresidency.com
VITE_RECEPTION_DOMAIN=reception.subraresidency.com
VITE_ADMIN_DOMAIN=admin.subraresidency.com
```

When a configured domain matches the browser hostname, the app loads only that portal at the root of that domain.

## Backend Wiring Guide

Add API clients and backend integration beside the portal that owns them:

```txt
src/features/customer/
src/features/reception/
src/features/admin/
```

Put code shared by all portals in `src/lib` or `src/components/ui`.

## Commands

```bash
npm run dev
npm run build
npm run preview
```
