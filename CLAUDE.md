# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MotoSuisse** is a used motorcycle sales website for an independent dealer. It combines a public-facing storefront with a private admin dashboard. The full functional specification is in `cahier_des_charges.md`. Mockup images are in `maquette/`.

---

## Commands

All commands run via Docker. Never run `npm` or `node` directly on the host.

```bash
# First-time setup: copy and fill env variables
cp .env.example .env.dev

# Start dev stack (hot-reload, ports exposed)
make dev

# Stop dev stack
make dev-down

# QA / prod equivalents
make qa / make qa-down
make prod / make prod-down
```

Service ports in dev:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- PostgreSQL: `localhost:5432` (also accessible via TablePlus/DBeaver)
- Swagger API docs: `http://localhost:3001/api/docs`

To run backend tests inside the container:
```bash
docker compose exec backend npm run test           # unit tests
docker compose exec backend npm run test:e2e       # e2e tests
docker compose exec backend npm run test:cov       # coverage
```

---

## IMPORTANT: Next.js 16 Breaking Changes

This project uses **Next.js 16** (not 14). APIs, conventions, and file structure may differ significantly from training data. **Before writing any frontend code, read the relevant guide in `frontend/node_modules/next/dist/docs/`** and heed any deprecation notices.

---

## Internationalisation (i18n)

The site is multilingual: **French (primary), English, and German.**

- French is the default language and must always be complete and polished first
- Use `next-intl` (or equivalent) with the App Router's `[locale]` segment: `/fr/`, `/en/`, `/de/`
- All user-facing strings must be externalised into locale files — no hardcoded UI text
- SEO metadata (title, description, Open Graph) must be translated per locale
- The admin dashboard is French-only (no need to translate it)

---

## Docker

**All services run via Docker.** Do not rely on locally installed Node, PostgreSQL, or any other runtime.

```
motosuisse/
├── docker-compose.yml          # Orchestrates all services
├── docker-compose.override.yml # Local dev overrides (hot-reload, etc.)
├── frontend/
│   └── Dockerfile
└── backend/
    └── Dockerfile
```

- `docker compose up` must bring up the full stack (frontend, backend, PostgreSQL)
- Use named volumes for the PostgreSQL data directory
- The backend `Dockerfile` must run `prisma migrate deploy` on startup (or via an entrypoint script)
- Hot-reload in development: mount source directories as volumes and use `dev` commands inside containers
- All environment variables are passed via `.env` files referenced in `docker-compose.yml` — never bake secrets into images

---

## Architecture

Monorepo with two separate apps:

```
motosuisse/
├── frontend/   # Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
└── backend/    # NestJS 11 (TypeScript, Prisma, PostgreSQL)
```

### Frontend — Next.js
- **Routing:** App Router with two root segments: public (`/`) and admin (`/admin/*`)
- **Styling:** Tailwind CSS v4 + shadcn/ui (or Radix UI)
- **Forms:** React Hook Form + Zod
- **State/data fetching:** TanStack Query (React Query)
- **Charts (admin dashboard):** Recharts or Chart.js
- **Blog editor (admin):** TipTap or React Quill
- **SEO:** Next.js Metadata API + next-sitemap (sitemap.xml, robots.txt)
- **Admin protection:** Next.js middleware guards all `/admin/*` routes

### Backend — NestJS
- **ORM:** Prisma with PostgreSQL
- **Auth:** JWT — access token (15 min) + refresh token (7 days); route guards on all admin endpoints
- **File uploads:** Multer + Cloudinary
- **Validation:** class-validator + class-transformer
- **API docs:** Swagger (`/api/docs`)

### Infrastructure
- Frontend → Vercel
- Backend → Railway or Render
- Database → Supabase (managed PostgreSQL)
- Images → Cloudinary

---

## Key Data Models

| Model | Key fields |
|---|---|
| `Moto` | `id, slug, marque, modele, annee, kilometrage, prix, description, statut (disponible\|vendu), images[], vues` |
| `Service` | `id, titre, description, prix_indicatif, image, actif, ordre` |
| `Article` | `id, titre, slug, contenu, image_couverture, statut (publié\|brouillon), meta_title, meta_description` |
| `Admin` | `id, email, mot_de_passe_hash` |
| `Vue` | `id, moto_id, date, count` (analytics — view counts per moto per day) |

---

## Public Routes

| Route | Description |
|---|---|
| `/` | Homepage |
| `/motos` | Full catalogue with filters (marque, type, prix, kilométrage) |
| `/motos/[slug]` | Moto detail page — also triggers a view increment on the backend |
| `/services` | Services page (sticker fitting, consignment sales) |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog article |
| `/contact` | Contact form |

## Admin Routes (`/admin/*` — auth required)

`/admin/login`, `/admin/dashboard`, `/admin/motos`, `/admin/motos/nouvelle`, `/admin/motos/[id]/edit`, `/admin/services`, `/admin/blog`, `/admin/blog/nouveau`, `/admin/stats`

---

## API Endpoints (NestJS)

All write endpoints require JWT auth. Key non-obvious endpoint: `GET /api/motos/:slug` both returns the moto data **and** increments the view counter.

---

## Design System

| Token | Value |
|---|---|
| Primary black | `#111111` |
| Primary red | `#E8192C` |
| White | `#FFFFFF` |
| Typography | Inter or Poppins (modern sans-serif) |
| Catalogue grid | 3 columns |
| Navbar | Fixed, black background |
| Footer | 4-column, dark |

---

## Security Constraints

- CORS: only the frontend domain is allowed
- Rate limiting on `/api/auth/login` and `/api/contact`
- Image uploads: MIME type checked, max 5 MB per image
- All secrets (JWT secret, DB URL, Cloudinary keys) via environment variables

---

## SEO Requirements

- Every moto page: `<title>[Marque] [Modèle] [Année] à vendre — [Site name]`
- Schema.org `Vehicle` + `Product` on moto detail pages
- Open Graph + Twitter Cards on all public pages
- URLs: lowercase, hyphen-separated, no special characters (e.g. `/motos/honda-cb500-2020`)
- Target: Core Web Vitals green, page load < 2s (use `next/image` + Cloudinary transforms)

---

## Development Phases

1. **Foundations** — NestJS + Next.js setup, Prisma + PostgreSQL, JWT auth, CI/CD environments
2. **Catalogue & Services** — CRUD API for motos/services, public pages, Cloudinary uploads, admin UI
3. **Blog & Contact** — Blog API + pages, contact form with email
4. **Analytics & Dashboard** — View tracking per moto, admin charts, final SEO (sitemap, Schema.org)
5. **Tests & Launch** — E2E tests (Playwright), Lighthouse audit, production deployment
