# Multi-stage production-optimized Dockerfile for AquaPump

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

FROM base AS deps
RUN npm install -g bun@latest
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production=false

FROM base AS builder
RUN npm install -g bun@latest
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV EXPO_USE_FAST_RESOLVER=1

RUN bun install --frozen-lockfile

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8081

RUN npm install -g bun@latest && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expouser && \
    mkdir -p /app/.expo && \
    chown -R expouser:nodejs /app

COPY --from=builder --chown=expouser:nodejs /app/package.json ./
COPY --from=builder --chown=expouser:nodejs /app/bun.lock* ./
COPY --from=builder --chown=expouser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expouser:nodejs /app/app ./app
COPY --from=builder --chown=expouser:nodejs /app/backend ./backend
COPY --from=builder --chown=expouser:nodejs /app/components ./components
COPY --from=builder --chown=expouser:nodejs /app/constants ./constants
COPY --from=builder --chown=expouser:nodejs /app/contexts ./contexts
COPY --from=builder --chown=expouser:nodejs /app/frontend ./frontend
COPY --from=builder --chown=expouser:nodejs /app/lib ./lib
COPY --from=builder --chown=expouser:nodejs /app/assets ./assets
COPY --from=builder --chown=expouser:nodejs /app/app.json ./
COPY --from=builder --chown=expouser:nodejs /app/tsconfig.json ./

USER expouser

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8081/api/health || exit 1

CMD ["bun", "run", "start-web-docker"]
