import {projectsManager} from "../data/mongoManager.js";

class ProjectsController {
    constructor(model) {
        this.controller = model;
    }

read = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const response = await this.controller.readByUser(userId);

        if (response.length === 0) {
            return res.json({ 
                statusCode: 200, 
                message: "No se encontraron proyectos para este usuario",
                response: [] 
            });
        }

        return res.json({ statusCode: 200, response });
    } catch (error) {
        next(error);
    }
}
    readOne = async (req, res, next) => {
        try {
            const {pid} = req.params
            const response = await this.controller.readOne(pid)
            if (!response) {
                let error = new Error(`No se encontro ningun proyecto con el id ${pid}`)
                error.statusCode = 404
                throw error
            } 
            return res.json({
                statusCode: 200,
                response
            })    
        } catch (error) {
            next(error)
        }
    }
    create = async (req, res, next) => {
        try {
            const data = req.body
            console.log(data)
            data.owner = req.user.id
            data.members = [req.user.id]
            const response = await this.controller.create(data)
            if (!response) {
                let error = new Error("Error al crear el proyecto")
                error.statusCode = 400
                throw error
            }
            return res.json({
                statusCode: 201,
                response
            })
        } catch (error) {
            next(error)
        }
    }
update = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const data = req.body;
        const userId = req.user._id;

        const response = await this.controller.readOne(pid);
        if (!response) {
            let error = new Error("Proyecto no encontrado")
            error.statusCode = 404
            throw error
        }
        const isOwner = project.ownerId.toString() === userId.toString();
        const isMember = project.members.map(memberId => memberId.toString()).includes(userId.toString());
        if (!isOwner && !isMember) {
            error = new Error("No tienes permisos para modificar este proyecto")
            error.statusCode = 403
            throw error
        }
        const updatedProject = await this.controller.update(pid, data);
        return res.json({
            statusCode: 200,
            response: updatedProject,
        });
    } catch (error) {
        next(error);
    }
};
    destroy = async (req, res, next) => {
        try {
            const { pid } = req.params;
            const userId = req.user.id;
            const project = await this.controller.readOne(pid);
            console.log(project.owner._id)
            console.log(userId)
            if (!project || project.owner._id.toString() !== userId) {
                const error = new Error("No tienes permiso para eliminar este proyecto")
                error.statusCode = 403
                throw error
            }
            await this.controller.destroy(pid);
            return res.json({
                message: "Proyecto eliminado exitosamente",
                statusCode: 200,
            });
        } catch (error) {
            next(error);
        }
    };
}

const projectsController = new ProjectsController(projectsManager);
export const {read, readOne, create, update, destroy} = projectsController;



