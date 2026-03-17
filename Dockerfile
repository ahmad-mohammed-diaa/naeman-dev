# ─── Stage 1: Builder ────────────────────────────────────────────────────────
# FROM node:20-alpine AS builder

# WORKDIR /app

# # Install all deps (including devDeps needed for build + tsc-alias)
# COPY package*.json ./
# RUN npm ci --legacy-peer-deps --ignore-scripts

# # Copy source + prisma schema + prisma config
# COPY prisma ./prisma
# COPY prisma.config.ts ./
# COPY . .

# # Generate Prisma client
# ARG DATABASE_URL=postgresql://x:x@localhost/x
# ENV DATABASE_URL=${DATABASE_URL}
# RUN npx prisma generate

# # Compile TypeScript → dist/, then resolve path aliases in-place with tsc-alias
# # (replaces @/*, src/*, generated/* imports with relative paths so plain node works)
# RUN npm run build && npx tsc-alias

# # ─── Stage 2: Runner ─────────────────────────────────────────────────────────
# FROM node:20-alpine AS runner

# WORKDIR /app

# # Install production deps only (tsconfig-paths NOT needed — aliases resolved at build time)
# COPY package*.json ./
# RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts

# # Copy prisma schema + config, then generate client inside prod node_modules
# COPY prisma ./prisma
# COPY prisma.config.ts ./
# ARG DATABASE_URL=postgresql://x:x@localhost/x
# ENV DATABASE_URL=${DATABASE_URL}
# RUN npx prisma generate

# # Unset the dummy DATABASE_URL so runtime gets the real one from Railway
# ENV DATABASE_URL=""

# # Copy compiled output (path aliases already resolved by tsc-alias)
# COPY --from=builder /app/dist ./dist

# # Copy custom Prisma client output (generated/prisma)
# COPY --from=builder /app/generated ./generated

# # Copy static assets
# COPY --from=builder /app/public ./public

# EXPOSE 3000

# # Run DB migrations then start the app
# CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]

# ─── Stage 1: Build ─────────────────────────────
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS app
RUN npm run build

# ─── Stage 2: Production ──────────────────────
FROM node:18-alpine

WORKDIR /app

# Copy only the built files + package.json + node_modules
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Set environment variables (can override in Fly secrets)
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Run the app
CMD ["node", "dist/main.js"]