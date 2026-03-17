# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (including devDeps needed for build)
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source
COPY prisma ./prisma
COPY . .

# Generate Prisma client (custom output: generated/prisma)
RUN npx prisma generate

# Compile TypeScript → dist/
RUN npm run build

# ─── Stage 2: Runner ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Re-generate Prisma client in production node_modules
COPY prisma ./prisma
RUN npx prisma generate

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Copy custom Prisma client output (generated/prisma)
COPY --from=builder /app/generated ./generated

# Copy tsconfig (required by tsconfig-paths at runtime for path alias resolution)
COPY tsconfig.json ./

# Copy static assets used at runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config

EXPOSE 3000

# Run migrations then start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node -r tsconfig-paths/register dist/src/main"]
