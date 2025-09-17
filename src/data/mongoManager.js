import Users from "./models/users.model.js";
import Tasks from "./models/task.model.js";
import Projects from "./models/project.model.js";
import {ObjectId} from "mongodb"


class MongoManager {
    constructor(model) { 
        this.model = model;
    }
    async read() {
        return await this.model.find().lean();
    }
    async readOne(id) {
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
    const projects = await this.model.find({ 
        members: { $in: [userObjectId] } 
    }).lean();

    return projects;
}
}

const usersManager = new MongoManager(Users);
const tasksManager = new MongoManager(Tasks);
const projectsManager = new MongoManager(Projects);

export {usersManager, tasksManager, projectsManager};

