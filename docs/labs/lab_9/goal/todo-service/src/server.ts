import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { AppDataSource } from "./database";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(taskRoutes);

const PORT = 3000;

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((error) => console.error("Database connection failed:", error));
