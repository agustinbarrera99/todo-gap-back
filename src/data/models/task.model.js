import { model, Schema, Types } from "mongoose";

let collection = "tasks";
const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pendiente", "En progreso", "A verificar","Completada"],
    default: "Pendiente",
  },
  project: { type: Types.ObjectId, ref: "projects", required: true },
  assignedTo: { type: Types.ObjectId, ref: "users" },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
}, {timestamps: true});


const Tasks = model(collection, schema);
export default Tasks;
