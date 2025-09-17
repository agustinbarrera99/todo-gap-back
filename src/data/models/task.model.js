import { model, Schema, Types } from "mongoose";

let collection = "tasks";
const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo",
  },
  project: { type: Types.ObjectId, ref: "Projects", required: true },
  assignedTo: { type: Types.ObjectId, ref: "Users" },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
}, {timestamps: true});

schema.pre("find", function () {
  this.populate("project", "name description owner");
  this.populate("assignedTo", "username email");

});

schema.pre("findOne", function () {
  this.populate("project", "name description owner");
  this.populate("assignedTo", "username email");
});

const Tasks = model(collection, schema);
export default Tasks;
