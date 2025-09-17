import { Router } from "express";
import { read, readOne, update, create, destroy } from "../controller/tasks.controller.js";

const tasksRouter = Router()

tasksRouter.get("/", read)
tasksRouter.get("/:pid", readOne)
tasksRouter.put("/:pid", update)
tasksRouter.post("/", create)
tasksRouter.delete("/:pid/:tid", destroy)

export default tasksRouter
