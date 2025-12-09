import { DataSource } from "typeorm";
import { env } from "./env";

export const AppDataSource = new DataSource({
  applicationName: "express-todo-app",
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: env.NODE_ENV === "development" ? true : false,
  logging: false,
  entities:
    process.env.NODE_ENV == "development"
      ? ["src/entities/**/*{.ts,.js}"]
      : ["dist/entities/**/*{.ts,.js}"],
  migrations:
    env.NODE_ENV === "development"
      ? ["src/database/migrations/*.ts"]
      : ["dist/database/migrations/*.js"],
  migrationsTableName: "migrations",
  subscribers: [],
  poolSize: 20,
});

export const getDataSource = (delay = 300): Promise<DataSource> => {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (AppDataSource.isInitialized) resolve(AppDataSource);
      else {
        AppDataSource.initialize()
          .then(() => resolve(AppDataSource))
          .catch((error) => reject(error));
      }
    }, delay);
  });
};
