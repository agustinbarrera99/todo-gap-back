import { usersManager } from "../data/mongoManager.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/hash.js";
import { verificationCode } from "../utils/verificationCode.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";

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
      if (!user.is_verified) {
        const error = new Error(
          "El usuario no ha verificado su cuenta. Por favor, revisa tu email."
        );
        error.statusCode = 401;
        throw error;
      }
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
      return res.json({
        statusCode: 200,
        message: "Se ha iniciado sesion correctamente",
        token,
        userId: user._id,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      return res.json({
        statusCode: 200,
        message: "Se ha cerrado la sesion correctamente",
      });
    } catch (error) {
      next(error);
    }
  };

  register = async (req, res, next) => {
    try {
      const { email, password, username } = req.body;
      if (!email || !password || !username) {
        const error = new Error(
          "El email, la contraseña y el nombre de usuario son requeridos"
        );
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
        const error = new Error(
          "La contraseña debe tener al menos 8 caracteres"
        );
        error.statusCode = 404;
        throw error;
      }
      const verification_code = verificationCode();
      const hashedPassword = createHash(password);
      const newUser = {
        ...req.body,
        password: hashedPassword,
        verification_code,
        is_verified: false,
      };
      await sendVerificationEmail(email, verification_code)
      const response = await this.controller.create(newUser);
      return res.json({
        statusCode: 201,
        response,
        message:
          "Usuario registrado. Revista tu email para verificar tu cuenta",
      });
    } catch (error) {
      return next(error);
    }
  };
  verifyEmail = async (req, res, next) => {
    try {
      const { email, code } = req.body; // Se recibe por query params
      const user = await this.controller.readByEmail(email);

      if (user.length === 0 || user[0].verification_code !== code) {
        const error = new Error("Código de verificación o email incorrecto.");
        error.statusCode = 400;
        throw error;
      }
      const userId = user[0]._id;
      const updatedUser = await this.controller.update(userId, {
        is_verified: true,
      });

      if (!updatedUser) {
        const error = new Error("Error al actualizar el usuario.");
        error.statusCode = 500;
        throw error;
      }

      return res.json({
        statusCode: 200,
        message: "Cuenta verificada exitosamente"
      })

    } catch (error) {
      next(error);
    }
  };
}

const authController = new AuthController(usersManager);
export const { login, logout, register, verifyEmail } = authController;
