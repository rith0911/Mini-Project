import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        description: { 
            type: String, 
            required: true 
        },
        suggestedBy: { 
            type: mongoose.Schema.Types.ObjectId, ref: 'User', 
            required: true 
        },
        status: { 
            type: String, 
            enum: ['suggested', 'completed'], default: 'suggested' 
        },
         dateAdded: { 
            type: Date, 
            default: Date.now },
    },
);

const Project = mongoose.model('Projects', ProjectSchema);

export default Project;