import { model, Schema, Types } from "mongoose";

let collection = "users";

let schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    projects: [{ type: Types.ObjectId, ref: "projects" }],
    verification_code: { type: String, required: true },
    is_verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Users = model(collection, schema);
export default Users;
