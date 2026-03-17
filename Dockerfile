# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install all deps — skip postinstall (it runs prisma generate before schema exists)
COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# Copy source + prisma schema + prisma config
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY . .

# Generate Prisma client
# DATABASE_URL is read by prisma.config.ts via dotenv/env() at generate time.
# A dummy value is enough — no real DB connection is made during code generation.
ARG DATABASE_URL=postgresql://x:x@localhost/x
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate

# Compile TypeScript → dist/
RUN npm run build

# ─── Stage 2: Runner ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Install production deps — skip postinstall for the same reason
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

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Copy custom Prisma client output (generated/prisma)
COPY --from=builder /app/generated ./generated

# Copy tsconfig (required by tsconfig-paths at runtime for path alias resolution)
COPY tsconfig.json ./

# Copy static assets used at runtime (only if they exist in the project)
COPY --from=builder /app/public ./public

EXPOSE 3000

# Run DB migrations then start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node -r tsconfig-paths/register dist/src/main"]