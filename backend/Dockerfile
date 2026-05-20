# syntax=docker/dockerfile:1.7

# ── Étape 1 : base commune ──────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
# npm ci déclenche automatiquement le postinstall "prisma generate"
RUN npm ci --include=dev --no-audit --no-fund

# ── Étape 2 : développement ─────────────────────────────────────────────────
FROM base AS dev
COPY . .
CMD ["node_modules/.bin/nest", "start", "--watch"]

# ── Étape 3 : compilation ───────────────────────────────────────────────────
FROM base AS build
COPY . .
# Le prisma generate a déjà été fait via postinstall lors de npm ci
RUN npm run build

# ── Étape 4 : production / QA ───────────────────────────────────────────────
FROM node:22-alpine AS prod
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY prisma ./prisma
# Install uniquement les dépendances de prod (postinstall regénère le client Prisma)
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=build /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/main"]
