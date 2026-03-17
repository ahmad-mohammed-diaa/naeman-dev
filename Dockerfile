# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install all deps (including devDeps needed for build + tsc-alias)
COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# Copy source + prisma schema + prisma config
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY . .

# Generate Prisma client
ARG DATABASE_URL=postgresql://x:x@localhost/x
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate

# Compile TypeScript → dist/, then resolve path aliases in-place with tsc-alias
# (replaces @/*, src/*, generated/* imports with relative paths so plain node works)
RUN npm run build && npx tsc-alias

# ─── Stage 2: Runner ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Install production deps only (tsconfig-paths NOT needed — aliases resolved at build time)
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts

# Copy prisma schema + config, then generate client inside prod node_modules
COPY prisma ./prisma
COPY prisma.config.ts ./
ARG DATABASE_URL=postgresql://x:x@localhost/x
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate

# Unset the dummy DATABASE_URL so runtime gets the real one from Railway
ENV DATABASE_URL=""

# Copy compiled output (path aliases already resolved by tsc-alias)
COPY --from=builder /app/dist ./dist

# Copy custom Prisma client output (generated/prisma)
COPY --from=builder /app/generated ./generated

# Copy static assets
COPY --from=builder /app/public ./public

EXPOSE 3000

# Run DB migrations then start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]