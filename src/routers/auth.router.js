import { login, logout, register, verifyEmail } from "../controller/auth.controller.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/register', register);
authRouter.post("/verify-email", verifyEmail)

export default authRouter;