import { DataSource } from "typeorm";
import { env } from "./env";
import { User } from "../entities/User";
import { Todo } from "../entities/Todo";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Todo],
  migrations: ["src/database/migrations/*.ts"],
  subscribers: [],
});
