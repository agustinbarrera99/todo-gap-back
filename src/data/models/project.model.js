import {model, Schema, Types} from 'mongoose';

let collection = 'projects';

const schema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
    owner: {type: Types.ObjectId, ref: 'users', required: true},
    members: [{type: Types.ObjectId, ref: 'users', required: true}],
    tasks: [{type: Types.ObjectId, ref: 'tasks'}],
    createdAt: {type: Date, default: Date.now},
}, {timestamps: true});

schema.pre("find", function() {
    this.populate("owner", "username email")
    this.populate("members", "username email")
    this.populate("tasks", "title description status assignedTo")
})

schema.pre("findOne", function() {
    this.populate("owner", "username email")
    this.populate("members", "username email")
    this.populate("tasks", "title description status assignedTo")
})

const Project = model(collection, schema);
export default Project;