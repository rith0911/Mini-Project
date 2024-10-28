import mongoose from "mongoose";

const MentorshipSchema = new mongoose.Schema(
    {
        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        mentee: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            }
        ],
        goals: {
            type: String,
        },
        meetings: [
            {
                type: Date,
            },
        ],
        status: {
            type: String,
            enum:['pending', 'accepted', 'rejected'],
            default:'pending'
        },
    }
);

const Mentorship = mongoose.model('mentorships',MentorshipSchema)

export default Mentorship;