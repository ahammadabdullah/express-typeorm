import "reflect-metadata";

import express from "express";
import { getDataSource } from "./config/db";
import { logger } from "./utils/logger";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

export const createApp = async () => {
  const app = express();

  try {
    await getDataSource();
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Failed to initialize database", error);
    throw error;
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1", routes);

  app.get("/api/v1", (req, res) => {
    res.json({ message: "Express Todo API is running" });
  });

  app.use(errorHandler);

  return app;
};
