import {usersManager} from "../data/mongoManager.js";

class UsersController {
    constructor(model) {
        this.controller = model;
    }
    read = async (req, res, next) => {
        try {
            const filter = {}
            if (req.query.username) {
                filter.username = new RegExp(req.query.username.trim(), "i")
            }
             const response = await this.controller.read(filter); 
            if (!response || response.length === 0) { // Añadí verificación de array vacío
                let error = new Error("No se encontraron usuarios")
                error.statusCode = 404
                throw error
            }
            return res.json({ statusCode: 200, data: response });
        } catch (error) {
            next(error);
        }
    }
    readOne = async (req, res, next) => {
        try {
            const { uid } = req.params;
            const response = await this.controller.readOne(uid);
            if (!response) {
                let error = new Error(`No se encontro ningun usuario con el ID: ${uid}`)
                error.statusCode = 404
                throw error
            }
            return res.json({ statusCode: 200, data: response });
        } catch (error) {
            next(error);
        }
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const response = await this.controller.create(data);
            if (!response) {
                let error = new Error("Error al crear el usuario")
                error.statusCode = 400
                throw error
            }
            return res.json({ statusCode: 201, data: response });
        } catch (error) {
            next(error);
        }
    }
    update = async (req, res, next) => {
        try {
            const { uid } = req.params;
            const data = req.body;
            const response = await this.controller.update(uid, data);
            if (!response) {
                let error = new Error("No se encontro el usuario a actualizar")
                error.statusCode = 404;
                throw error
            }
            return res.json({ statusCode: 200, data: response });
        } catch (error) {
            next(error);
        }
    }
    destroy = async (req, res, next) => {
        try {  
            const { uid } = req.params;
            const response = await this.controller.destroy(uid);
            if (!response) {
                let error = new Error("No se encontro el usuario a eliminar")
                error.statusCode = 404
                throw error
            }   
            return res.json({ statusCode: 200, data: response });
        } catch (error) {
            next(error);
        }
    }
}

const usersController = new UsersController(usersManager);
export const {read, readOne, create, update, destroy} = usersController;
