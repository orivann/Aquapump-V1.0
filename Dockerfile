# Stage 1: Install dependencies
FROM node:20-slim AS deps

WORKDIR /usr/src/app

# Install bun
RUN npm install -g bun

# Copy package.json and bun.lock to leverage Docker cache
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production=false

# Stage 2: Build stage (if needed for optimizations)
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Install bun
RUN npm install -g bun

# Copy dependencies
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Stage 3: Production runner
FROM node:20-slim AS runner

WORKDIR /usr/src/app

# Install bun and production dependencies only
RUN npm install -g bun

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expouser

# Copy dependencies and application
COPY --from=builder --chown=expouser:nodejs /usr/src/app/node_modules ./node_modules
COPY --chown=expouser:nodejs . .

# Switch to non-root user
USER expouser

# Expose the port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8081/api', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["bun", "run", "start-web-docker"]