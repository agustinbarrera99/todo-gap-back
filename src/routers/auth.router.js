import { login, logout, register } from "../controller/auth.controller.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/register', register);

export default authRouter;