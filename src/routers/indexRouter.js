import { Router } from "express";
import usersRouter from "./users.router.js";
import authRouter from "./auth.router.js";
import projectsRouter from "./projects.router.js";
import tasksRouter from "./tasks.router.js";

const indexRouter = Router();

indexRouter.use('/users', usersRouter);
indexRouter.use('/auth', authRouter);
indexRouter.use("/projects", projectsRouter);
indexRouter.use("/tasks", tasksRouter)

export default indexRouter;