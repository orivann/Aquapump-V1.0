import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

app.use("*", logger());

app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || '*',
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-trpc-source'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
  })
);

app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

app.get("/", (c) => {
  return c.json({ 
    status: "ok", 
    message: "AquaPump API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/health", (c) => {
  return c.json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get("/ready", (c) => {
  return c.json({ 
    status: "ready",
    timestamp: new Date().toISOString()
  });
});

app.notFound((c) => {
  return c.json({ error: "Not Found", path: c.req.path }, 404);
});

app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ 
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  }, 500);
});

export default app;
