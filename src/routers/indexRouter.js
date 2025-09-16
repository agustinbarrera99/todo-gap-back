import { Router } from "express";
import usersRouter from "./users.router.js";
import authRouter from "./auth.router.js";
const indexRouter = Router();

indexRouter.use('/users', usersRouter);
indexRouter.use('/auth', authRouter);

export default indexRouter;