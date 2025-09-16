import Users from "./models/users.model.js";

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
}

const usersManager = new MongoManager(Users);
export default usersManager;

