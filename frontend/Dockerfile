# syntax=docker/dockerfile:1.7

# ── Étape 1 : base commune ──────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
# --include=dev pour que tailwind/typescript soient dispo au build
# --no-audit --no-fund pour accélérer et stabiliser npm ci
RUN npm ci --include=dev --no-audit --no-fund

# ── Étape 2 : développement ─────────────────────────────────────────────────
FROM base AS dev
COPY . .
CMD ["node_modules/.bin/next", "dev", "--hostname", "0.0.0.0"]

# ── Étape 3 : compilation ───────────────────────────────────────────────────
FROM base AS build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
COPY . .
RUN npm run build

# ── Étape 4 : production / QA ───────────────────────────────────────────────
# next.config.ts doit avoir output: "standalone" (✓ c'est ton cas)
FROM node:22-alpine AS prod
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
# Copie uniquement ce qui est nécessaire pour faire tourner le serveur
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
