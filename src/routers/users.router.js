import { Router } from "express";
import {read, readOne, create, update, destroy} from "../controller/users.controller.js";

const usersRouter = Router();

usersRouter.get('/', read);
usersRouter.get('/:uid', readOne);
usersRouter.post('/', create);
usersRouter.put('/:uid', update);
usersRouter.delete('/:uid', destroy);

export default usersRouter;

