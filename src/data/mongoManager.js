import Users from "./models/users.model.js";
import Tasks from "./models/task.model.js";
import Projects from "./models/project.model.js";
import { ObjectId } from "mongodb";

class MongoManager {
  constructor(model) {
    this.model = model;
  }
  async read(filter = {}) {
    return await this.model.find(filter).lean();
  }
  async readOne(id) {
    if (this.model.modelName === "Project") {
      return await this.model
        .findById(id)
        .populate("owner", "username email")
        .populate("members", "username email")
        .lean();
    }
    return await this.model.findById(id).lean();
  }
  async create(data) {
    return await this.model.create(data);
  }
  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }
  async destroy(id) {
    return await this.model.findByIdAndDelete(id);
  }
  async readByEmail(email) {
    return await this.model.find({ email: email }).lean();
  }
  async readByUser(userId) {
    const userObjectId = new ObjectId(userId);
    const projects = await this.model
      .find({
        members: { $in: [userObjectId] },
      })
      .lean();

    return projects;
  }
    async searchUsers(searchTerm) {
        if (this.model.modelName !== "User" || !searchTerm) {
            return []; 
        }
        
        const trimmedQuery = searchTerm.trim();
        if (trimmedQuery.length < 3) {
             return [];
        }

        const regex = new RegExp(trimmedQuery, 'i'); 
        
        const filter = {
            $or: [
                { name: { $regex: regex } },
                { username: { $regex: regex } },
                { email: { $regex: regex } }
            ]
        };
        
        // Usamos this.read(filter) para aplicar la búsqueda
        const users = await this.read(filter); 

        // Opcional: Limitar la cantidad de resultados y seleccionar campos después del read()
        // Si read() no permite select/limit, los aplicamos aquí:
        return users.slice(0, 10).map(user => ({
             _id: user._id,
             name: user.name,
             username: user.username,
             email: user.email
        }));
    }
}

const usersManager = new MongoManager(Users);
const tasksManager = new MongoManager(Tasks);
const projectsManager = new MongoManager(Projects);

export { usersManager, tasksManager, projectsManager };
