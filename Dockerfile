# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install all deps — skip postinstall (it runs prisma generate before schema exists)
COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# Copy source + prisma schema
COPY prisma ./prisma
COPY . .

# Generate Prisma client (custom output: generated/prisma)
RUN npx prisma generate

# Compile TypeScript → dist/
RUN npm run build

# ─── Stage 2: Runner ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Install production deps — skip postinstall for the same reason
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts

# Copy prisma schema, then generate client inside prod node_modules
COPY prisma ./prisma
RUN npx prisma generate

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Copy custom Prisma client output (generated/prisma)
COPY --from=builder /app/generated ./generated

# Copy tsconfig (required by tsconfig-paths at runtime for path alias resolution)
COPY tsconfig.json ./

# Copy static assets used at runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config

EXPOSE 3000

# Run DB migrations then start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node -r tsconfig-paths/register dist/src/main"]
