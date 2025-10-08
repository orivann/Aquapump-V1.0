# Stage 1: Install dependencies
FROM node:20-slim AS deps

WORKDIR /usr/src/app

# Install bun
RUN npm install -g bun

# Copy package.json and bun.lock to leverage Docker cache
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile


# Stage 2: Setup runner
FROM node:20-slim

WORKDIR /usr/src/app

# Install bun
RUN npm install -g bun

# Copy dependencies from deps stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8081

# Define the command to start the app
CMD ["bun", "run", "start-web-docker"]