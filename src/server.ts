import { Server } from 'http';
import { createApp } from './app';
import { database, env } from './config';

const app = createApp();
let server: Server;

async function startServer(): Promise<void> {
  try {
    await database.connect();

    server = app.listen(env.port, () => {
      console.info(
        `[Server] Running in ${env.nodeEnv} mode on port ${env.port}`,
      );
      console.info(`[Server] API available at /api/${env.apiVersion}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string): Promise<void> {
  console.info(`[Server] ${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.info('[Server] HTTP server closed');

      try {
        await database.disconnect();
        process.exit(0);
      } catch (error) {
        console.error('[Server] Error during shutdown:', error);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }

  setTimeout(() => {
    console.error('[Server] Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: unknown) => {
  console.error('[Server] Unhandled Rejection:', reason);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (error: Error) => {
  console.error('[Server] Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

void startServer();
