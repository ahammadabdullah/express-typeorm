import "reflect-metadata";

import "./types/globals";
import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { initRedis } from "./lib/redis";

const startServer = async () => {
  try {
    await initRedis();
    const app = await createApp();

    app.listen(env.PORT, () => {
      logger.info(`Server started on port ${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
