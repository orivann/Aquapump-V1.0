import app from "./hono";

const PORT = parseInt(process.env.PORT || "8081", 10);
const HOST = process.env.HOST || "0.0.0.0";

console.log(`[Server] Starting AquaPump Backend...`);
console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`[Server] Port: ${PORT}`);
console.log(`[Server] Host: ${HOST}`);

const server = Bun.serve({
  port: PORT,
  hostname: HOST,
  fetch: app.fetch,
  development: process.env.NODE_ENV !== 'production',
});

console.log(`[Server] ✅ AquaPump Backend is running!`);
console.log(`[Server] 🌐 API available at: http://${HOST}:${PORT}`);
console.log(`[Server] 🔍 Health check: http://${HOST}:${PORT}/health`);
console.log(`[Server] 📡 tRPC endpoint: http://${HOST}:${PORT}/api/trpc`);

process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down gracefully');
  server.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received, shutting down gracefully');
  server.stop();
  process.exit(0);
});
