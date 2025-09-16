import usersManager from "../data/mongoManager.js";

class UsersController {
    constructor(model) {
        this.controller = model;
    }
    read = async (req, res, next) => {
        try {
            const response = await this.controller.read();
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
                return res.json({ statusCode: 404, message: "User not found" });
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
                return res.json({ statusCode: 404, message: "User not found" });
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
                return res.json({ statusCode: 404, message: "User not found" });
            }   
            return res.json({ statusCode: 200, data: response });
        } catch (error) {
            next(error);
        }
    }
}

const usersController = new UsersController(usersManager);
export const {read, readOne, create, update, destroy} = usersController;
