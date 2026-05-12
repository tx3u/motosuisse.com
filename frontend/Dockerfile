# ── Étape 1 : base commune ──────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Étape 2 : développement ─────────────────────────────────────────────────
FROM base AS dev
COPY . .
CMD ["node_modules/.bin/next", "dev", "--hostname", "0.0.0.0"]

# ── Étape 3 : compilation ────────────────────────────────────────────────────
FROM base AS build
COPY . .
RUN npm run build

# ── Étape 4 : production / QA ────────────────────────────────────────────────
# next.config.ts doit avoir output: "standalone" pour que ce stage fonctionne
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
# Copie uniquement ce qui est nécessaire pour faire tourner le serveur
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
