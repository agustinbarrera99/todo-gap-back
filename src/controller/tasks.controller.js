import { tasksManager } from "../data/mongoManager.js";
import { projectsManager } from "../data/mongoManager.js";

class TasksController {
  constructor(tasksModel, projectsModel) {
    this.tasksModel = tasksModel;
    this.projectsModel = projectsModel;
  }
  create = async (req, res, next) => {
    try {
      const { pid } = req.params;
      const data = req.body;
      const userId = req.user.id;
      const project = await this.projectsModel.readOne(pid);
      console.log(project)
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        error.statusCode = 404;
        throw error;
      }
      console.log(project);
      const isMember = project.members.some(
        (memberId) => memberId._id.toString() === userId.toString()
      );
      if (!isMember) {
        const error = new Error(
          "No tienes permisos para crear tareas en este proyecto"
        );
        error.statusCode = 403;
        throw error;
      }
      data.project = pid;
      const newTask = await this.tasksModel.create(data);
      project.tasks.push(newTask._id);
      await this.projectsModel.update(pid, project);
      return res.json({
        statusCode: 201,
        response: newTask,
      });
    } catch (error) {
      next(error);
    }
  };
  read = async (req, res, next) => {
    try {
      // 1. Obtener el ID del proyecto de la URL
      const { pid } = req.params;
      const userId = req.user.id; // Asumiendo que has unificado a req.user.id

      // 2. CORRECCIÓN: Usar readOne para obtener UN solo proyecto por ID
      // (Asumo que projectsManager tiene un readOne que acepta el ID)
      const project = await this.projectsModel.readOne(pid);
      console.log(project)

      if (!project) {
        const error = new Error("Proyecto no encontrado");
        error.statusCode = 404;
        throw error;
      }

      // 3. Verificación de Membresía (usando member._id ya que está populado)
      const isMember = project.members.some(
        (member) => member._id.toString() === userId.toString()
      );

      if (!isMember) {
        const error = new Error(
          "No tienes permisos para ver las tareas de este proyecto"
        );
        error.statusCode = 403;
        throw error;
      }

      // 4. FILTRADO CLAVE: Llama a tasksManager.read() y le pasa el filtro { project: pid }
      const tasks = await this.tasksModel.read({ project: pid });

      return res.json({
        statusCode: 200,
        response: tasks,
      });
    } catch (error) {
      next(error);
    }
  };

  readOne = async (req, res, next) => {
    try {
      const { pid, tid } = req.params;
      const userId = req.user.id;

      const project = await this.projectsModel.readOne(pid);
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        error.statusCode = 404;
        throw error;
      }

      const isMember = project.members.some(
        (memberId) => memberId.toString() === userId.toString()
      );
      if (!isMember) {
        const error = new Error("No tienes permisos para ver esta tarea");
        error.statusCode = 403;
        throw error;
      }
      const task = await this.tasksModel.readOne(tid);
      if (!task) {
        const error = new Error("Tarea no encontrada");
        error.statusCode = 404;
        throw error;
      }

      if (task.project.toString() !== pid.toString()) {
        const error = new Error("La tarea no pertenece a este proyecto");
        error.statusCode = 404;
        throw error;
      }

      return res.json({
        statusCode: 200,
        response: task,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { pid, tid } = req.params;
      const data = req.body;
      const userId = req.user.id;
      const project = await this.projectsModel.readOne(pid);
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        error.statusCode = 404;
        throw error;
      }

      const task = this.tasksModel.readOne(tid)

      const isMember = project.members.some(
        (memberId) => memberId.toString() === userId.toString()
      );
      if (!isMember) {
        const error = new Error(
          "No tienes permisos para actualizar esta tarea"
        );
        error.statusCode = 403;
        throw error;
      }

      const updatedTask = await this.tasksModel.update(tid, data);
      if (!updatedTask) {
        const error = new Error("Tarea no encontrada");
        error.statusCode = 404;
        throw error;
      }

      return res.json({
        statusCode: 200,
        response: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  };
  destroy = async (req, res, next) => {
    try {
      const { pid, tid } = req.params;
      const userId = req.user.id;
      const project = await this.projectsModel.readOne(pid);
      if (!project) {
        const error = new Error("Proyecto no encontrado");
        error.statusCode = 404;
        throw error;
      }

      const isMember = project.members.some(
        (memberId) => memberId.toString() === userId.toString()
      );
      if (!isMember) {
        const error = new Error("No tienes permisos para eliminar esta tarea");
        error.statusCode = 403;
        throw error;
      }
      const deletedTask = await this.tasksModel.destroy(tid);
      if (!deletedTask) {
        const error = new Error("Tarea no encontrada");
        error.statusCode = 404;
        throw error;
      }

      project.tasks = project.tasks.filter(
        (taskId) => taskId.toString() !== tid.toString()
      );
      await this.projectsModel.update(pid, project);

      return res.json({
        statusCode: 200,
        message: "Tarea eliminada exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };
}

const tasksController = new TasksController(tasksManager, projectsManager);

export const { read, readOne, create, update, destroy } = tasksController;
