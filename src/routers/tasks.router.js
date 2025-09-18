import { Router } from "express";
import { read, readOne, update, create, destroy } from "../controller/tasks.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const tasksRouter = Router()

tasksRouter.get("/project/:pid", authMiddleware, read); 
tasksRouter.get("/:tid/detail", authMiddleware, readOne);
tasksRouter.put("/:pid/:tid", authMiddleware,update)
tasksRouter.post("/:pid", authMiddleware, create)
tasksRouter.delete("/:pid/:tid", authMiddleware, destroy)

export default tasksRouter
