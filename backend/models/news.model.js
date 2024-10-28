import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true
        },
        department: {
            type: String, 
            required: true
        },
        crossBranch: {
            type: Boolean, 
            default: false
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        },
        datePosted: {
            type: Date, 
            default: Date.now
        },
    }
);

const News = mongoose.model('News', NewsSchema);

export default News;