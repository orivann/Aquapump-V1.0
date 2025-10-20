# Multi-stage production-optimized Dockerfile for AquaPump
# Uses Alpine for smaller image size and better security

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat curl dumb-init
WORKDIR /app

# Stage 1: Install dependencies
FROM base AS deps
RUN npm install -g bun@latest
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production=false

# Stage 2: Build stage
FROM base AS builder
RUN npm install -g bun@latest
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV EXPO_USE_FAST_RESOLVER=1

# Stage 3: Production runner (slim)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8081

RUN npm install -g bun@latest && \
    addgroup -g 1001 -S nodejs && \
    adduser -S expouser -u 1001 && \
    mkdir -p /app/.expo && \
    chown -R expouser:nodejs /app

# Copy only production files
COPY --from=builder --chown=expouser:nodejs /app/package.json ./
COPY --from=builder --chown=expouser:nodejs /app/bun.lock* ./
COPY --from=builder --chown=expouser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expouser:nodejs /app/app ./app
COPY --from=builder --chown=expouser:nodejs /app/backend ./backend
COPY --from=builder --chown=expouser:nodejs /app/components ./components
COPY --from=builder --chown=expouser:nodejs /app/constants ./constants
COPY --from=builder --chown=expouser:nodejs /app/contexts ./contexts
COPY --from=builder --chown=expouser:nodejs /app/lib ./lib
COPY --from=builder --chown=expouser:nodejs /app/assets ./assets
COPY --from=builder --chown=expouser:nodejs /app/app.json ./
COPY --from=builder --chown=expouser:nodejs /app/tsconfig.json ./

USER expouser

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8081/api/health || exit 1

CMD ["dumb-init", "bun", "run", "start-web-docker"]