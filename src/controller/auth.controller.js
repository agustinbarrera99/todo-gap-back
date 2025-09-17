import {usersManager} from "../data/mongoManager.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/hash.js";

class AuthController {
  constructor(model) {
    this.controller = model;
  }
  login = async (req, res, next) => {
    try {
      if (!req.body) {
        const error = new Error("El email y la contraseña son requeridos");
        error.statusCode = 400;
        throw error;
      }
      const { email, password } = req.body;  
      if (!email || !password) {
        const error = new Error("El email y la contraseña son requeridos");
        error.statusCode = 400;
        throw error;
      }
      const users = await this.controller.readByEmail(email);
      if (users.length === 0) {
        const error = new Error("Email o contraseña incorrectos");
        error.statusCode = 401;
        throw error;
      }
      const user = users[0];
      const isValid = isValidPassword(password, user.password);
      if (!isValid) {
        const error = new Error("Email o contraseña incorrectos");
        error.statusCode = 401;
        throw error;
      }
      const payload = { id: user._id, email: user.email, role: user.role };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      return res.json({ statusCode: 200, message: "Se ha iniciado sesion correctamente", token });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      return res.json({ statusCode: 200, message: "Se ha cerrado la sesion correctamente" });
    } catch (error) {
      next(error);
    }
  };

  register = async (req, res, next) => {
    try {
      const { email, password, username } = req.body;
      console.log(req.body);
      if (!email || !password) {
        const error = new Error("El email, la contraseña y el nombre de usuario son requeridos");
        error.statusCode = 400;
        throw error;
      }
      const one = await this.controller.readByEmail(email);
      if (one.length > 0) {
        const error = new Error("El email ya esta registrado");
        error.statusCode = 400;
        throw error;
      }
      if (password.length < 8) {
        const error = new Error("La contraseña debe tener al menos 8 caracteres");
        error.statusCode = 404
        throw error;
      }
      const hashedPassword = createHash(password);
      const newUser = { ...req.body, password: hashedPassword };
      const response = await this.controller.create(newUser);
      return res.json({ statusCode: 201, response });
    } catch (error) {
      return next(error);
    }
  };
}

const authController = new AuthController(usersManager);
export const { login, logout, register } = authController;
