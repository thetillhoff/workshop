import { DataSource } from "typeorm";
import { Task } from "./entities/task";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Auto creates tables, disable in production
  logging: false,
  entities: [Task],
  cache: {
    type: "redis",
    options: {
      socket: {
          host: process.env.REDIS_ENDPOINT,
          port: 6379,
          tls: true,
          connectTimeout: 100, // 100ms
          rejectUnauthorized: process.env.REDIS_ENDPOINT !== 'redis:6379', // true by default. Set this to false to disable certificate validation in local setups like docker-compose.yml
      },
    },
  },
});
