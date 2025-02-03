import { DataSource } from "typeorm";
import { Task } from "./entities/task";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "postgres",
  synchronize: true, // Auto creates tables, disable in production
  logging: false,
  entities: [Task],
});
