import { getDataSource } from "../config/db";
import { seedDatabase } from "./seeders/seed";
import { logger } from "../utils/logger";

const runSeeder = async () => {
  try {
    await getDataSource();
    await seedDatabase();
    logger.info("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    logger.error("Seeding failed", error);
    process.exit(1);
  }
};

runSeeder();
