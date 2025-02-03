import { Request, Response } from "express";
import { AppDataSource } from "../database";
import { Task } from "../entities/task";

// Fetch the repository
const taskRepository = AppDataSource.getRepository(Task);

// Create a task
export const createTask = async (req: Request, res: Response) => {
  const { title, description, dueDate, status, userEmail } = req.body;

  console.log("POST /tasks with body:", req.body);

  try {
    const newTask = taskRepository.create({
      title,
      description,
      dueDate,
      status,
      userEmail,
    });
    await taskRepository.save(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task", details: error });
  }
};

// Get all tasks
export const getTasks = async (_req: Request, res: Response) => {
  console.log("GET /tasks");

  try {
    const tasks = await taskRepository.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks", details: error });
  }
};

// Get a specific task by ID
export const getTaskById = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  console.log("GET /tasks/:taskId with taskId:", taskId);

  try {
    const task = await taskRepository.findOneBy({ taskId });
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task", details: error });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  console.log("DELETE /tasks/:taskId with taskId:", taskId);

  try {
    const result = await taskRepository.delete({ taskId });
    if (result.affected === 0)
      return res.status(404).json({ error: "Task not found" });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task", details: error });
  }
};
