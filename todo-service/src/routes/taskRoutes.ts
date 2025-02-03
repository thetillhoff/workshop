import { RequestHandler, Router } from "express";
import { createTask, getTasks, getTaskById, deleteTask } from "../controllers/taskController";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.post("/tasks", createTask);
router.get("/tasks", getTasks as RequestHandler);
router.get("/tasks/:taskId", getTaskById as RequestHandler);
router.delete("/tasks/:taskId", deleteTask as RequestHandler);

export default router;
