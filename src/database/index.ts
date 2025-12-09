import { AppDataSource } from "../config/db";
import { seedDatabase } from "./seeders/seed";
import { logger } from "../utils/logger";

const runSeeder = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connection established");

    await seedDatabase();

    await AppDataSource.destroy();
    logger.info("Database connection closed");
    process.exit(0);
  } catch (error) {
    logger.error("Seeding failed", error);
    process.exit(1);
  }
};

runSeeder();
