import { Router } from "express";
import { read, readOne, destroy, update, create, removeMember} from "../controller/projects.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const projectsRouter = Router();

projectsRouter.get('/', authMiddleware, read)
projectsRouter.get('/:pid', authMiddleware,readOne)
projectsRouter.put('/:pid', authMiddleware,update)
projectsRouter.delete('/:pid', authMiddleware,destroy)
projectsRouter.post('/', authMiddleware,create) 
projectsRouter.delete('/:pid/members/:uid', authMiddleware, removeMember); 
export default projectsRouter;
