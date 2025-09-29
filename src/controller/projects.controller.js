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
            console.log(response)
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
        const creatorId = req.user.id 
        
        const sentMembers = Array.isArray(data.members) ? data.members : [];
        

        const uniqueMemberIds = new Set([creatorId, ...sentMembers]);
        
        data.owner = creatorId; 
        data.members = Array.from(uniqueMemberIds);
        
        const response = await this.controller.create(data);
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
        const userId = req.user.id;

        const response = await this.controller.readOne(pid);
        if (!response) {
            let error = new Error("Proyecto no encontrado")
            error.statusCode = 404
            throw error
        }
        console.log(userId, response.owner._id)
        const isOwner = response.owner._id == userId;
        const isMember = response.members.map(memberId => memberId).includes(userId);
        console.log(isMember, isOwner)
        if (!isOwner && !isMember) {
            let error = new Error("No tienes permisos para modificar este proyecto")
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
        
        if (!project) {
            const error = new Error("Proyecto no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        const ownerId = project.owner._id ? project.owner._id.toString() : project.owner.toString();

        if (ownerId !== userId) {
            const error = new Error("No tienes permiso para eliminar este proyecto. Solo el propietario puede hacerlo.");
            error.statusCode = 403;
            throw error;
        }
        const result = await this.controller.destroy(pid); 
        
        if (!result) {
             const error = new Error("El proyecto no pudo ser eliminado (ya no existe o error interno).");
             error.statusCode = 500;
             throw error;
        }
        
        return res.json({
            message: "Proyecto eliminado exitosamente",
            statusCode: 200,
        });
    } catch (error) {
        next(error);
    }
};
    removeMember = async (req, res, next) => {
    try {
        const { pid: projectId, uid: memberId } = req.params;
        const userId = req.user.id;

        if (projectId === undefined || memberId === undefined) {
             const error = new Error("El ID del proyecto y del miembro son requeridos.");
             error.statusCode = 400;
             throw error;
        }

        const project = await this.controller.readOne(projectId);
        console.log(project)

        if (!project) {
            const error = new Error("Proyecto no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        if (project.owner._id != userId) {
            const error = new Error("Solo el propietario del proyecto puede eliminar miembros.");
            error.statusCode = 403; // Prohibido
            throw error;
        }
        
        if (project.owner._id == memberId) {
            const error = new Error("No puedes eliminar al propietario del proyecto.");
            error.statusCode = 400;
            throw error;
        }

        const updatedMembers = project.members
            .map(m => m._id.toString())
            .filter(id => id !== memberId);

        console.log(updatedMembers)
        
        const updatedProject = await this.controller.update(projectId, { members: updatedMembers });

        return res.json({
            statusCode: 200,
            message: `Miembro ${memberId} eliminado exitosamente.`,
            response: updatedProject
        });

    } catch (error) {
        next(error);
    }
}

}

const projectsController = new ProjectsController(projectsManager);
export const {read, readOne, create, update, destroy, removeMember} = projectsController;



