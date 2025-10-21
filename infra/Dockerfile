FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat curl dumb-init
WORKDIR /app

FROM base AS deps
RUN npm install -g bun@latest
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8081
ENV EXPO_USE_FAST_RESOLVER=1

RUN npm install -g bun@latest && \
    addgroup -g 1001 -S nodejs && \
    adduser -S expouser -u 1001 && \
    mkdir -p /app/.expo && \
    chown -R expouser:nodejs /app

COPY --from=deps --chown=expouser:nodejs /app/node_modules ./node_modules
COPY --chown=expouser:nodejs package.json bun.lock* ./
COPY --chown=expouser:nodejs frontend ./frontend
COPY --chown=expouser:nodejs backend ./backend
COPY --chown=expouser:nodejs tsconfig.json ./

USER expouser

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8081/api/health || exit 1

CMD ["dumb-init", "bun", "run", "start-web-docker"]