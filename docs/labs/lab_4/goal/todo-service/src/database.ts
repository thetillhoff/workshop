import { DataSource } from "typeorm";
import { Task } from "./entities/task";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "databasestack-databasecluster68fc2945-9rqe6ftszqhl.cluster-cvu4og6qcldr.eu-central-1.rds.amazonaws.com", // change me
  port: 5432,
  username: "postgres",
  password: "qiwOhyDT,aqDWYx-mk1e-,Cc4w769N", // change me
  database: "postgres",
  synchronize: true, // Auto creates tables, disable in production
  logging: false,
  entities: [Task],
});
