# Stage 1: Install dependencies
FROM oven/bun:1 AS deps

WORKDIR /usr/src/app

# Copy package.json and bun.lockb to leverage Docker cache
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile


# Stage 2: Setup runner
FROM oven/bun:1

WORKDIR /usr/src/app

# Copy dependencies from deps stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8081

# Define the command to start the app
CMD ["bun", "run", "start-web-docker"]