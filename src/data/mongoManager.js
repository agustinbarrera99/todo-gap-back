import Users from "./models/users.model.js";
import Tasks from "./models/task.model.js";
import Projects from "./models/project.model.js";
import { ObjectId } from "mongodb";

class MongoManager {
  constructor(model) {
    this.model = model;
  }
  async read(filter = {}) {
    if (this.model.modelName === "tasks") {
      return await this.model
        .find(filter)
        .populate("assignedTo", "username email") 
        .lean();
    }
    return await this.model.find(filter).lean();
  }

  async readOne(id) {
    if (this.model.modelName === "projects") {
      const projects = await this.model
        .find({ _id: id }) 
        .populate("owner", "username email")
        .populate("members", "username email")
        .lean();

      return projects.length > 0 ? projects[0] : null;
    }
    return await this.model.findById(id).lean();
  }
  async create(data) {
    return await this.model.create(data);
  }
  async update(id, data) {
    let updatedProject = await this.model.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (this.model.modelName === "projects" && updatedProject) {
      updatedProject = await this.model
        .findById(id)
        .populate("owner", "username email")
        .populate("members", "username email")
        .lean(); 

      return updatedProject;
    }

    return updatedProject;
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
      .populate("owner", "username")
      .populate("members", "username email")
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

    const regex = new RegExp(trimmedQuery, "i");

    const filter = {
      $or: [
        { name: { $regex: regex } },
        { username: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    };

    const users = await this.read(filter);

    return users.slice(0, 10).map((user) => ({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    }));
  }
}

const usersManager = new MongoManager(Users);
const tasksManager = new MongoManager(Tasks);
const projectsManager = new MongoManager(Projects);

export { usersManager, tasksManager, projectsManager };
