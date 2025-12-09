import "dotenv/config";

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000"),
  JWT_SECRET: process.env.JWT_SECRET || "abcd1234",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT || "5432"),
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_NAME: process.env.DB_NAME || "express_todo",
};
