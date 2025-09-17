import { Router } from "express";
import { read, readOne, destroy, update, create} from "../controller/projects.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const projectsRouter = Router();

projectsRouter.get('/', authMiddleware, read)
projectsRouter.get('/:pid', readOne)
projectsRouter.put('/:pid', update)
projectsRouter.delete('/:pid', destroy)
projectsRouter.post('/', authMiddleware,create) 

export default projectsRouter;
