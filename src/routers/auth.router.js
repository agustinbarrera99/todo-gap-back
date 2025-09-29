import { login, logout, register, verifyEmail, forgotPassword, resetPassword } from "../controller/auth.controller.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/register', register);
authRouter.post("/verify-email", verifyEmail)
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPassword); 

export default authRouter;