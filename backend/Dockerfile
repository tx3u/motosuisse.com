# ── Étape 1 : base commune ──────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# ── Étape 2 : développement ─────────────────────────────────────────────────
FROM base AS dev
COPY . .
CMD ["sh", "-c", "npx prisma db push && npm run start:dev"]

# ── Étape 3 : compilation ────────────────────────────────────────────────────
FROM base AS build
COPY . .
RUN npx prisma generate
RUN npm run build

# ── Étape 4 : production / QA ────────────────────────────────────────────────
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
CMD ["sh", "-c", "npx prisma db push && node dist/main"]
