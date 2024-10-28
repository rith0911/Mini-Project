import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        post: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            }
        ],
    }
);

const Group = mongoose.model("Group", GroupSchema);

export default Group;