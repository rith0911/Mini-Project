import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description:{
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    }
);

const Departments = new mongoose.model('departments', departmentSchema);

export default Departments;