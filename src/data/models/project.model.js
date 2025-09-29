import {model, Schema, Types} from 'mongoose';

let collection = 'projects';

const schema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
    owner: {type: Types.ObjectId, ref: 'users', required: true},
    members: [{type: Types.ObjectId, ref: 'users', required: true}],
    tasks: [{type: Types.ObjectId, ref: 'tasks'}],
    createdAt: {type: Date, default: Date.now},
}, {timestamps: true});


const Project = model(collection, schema);
export default Project;