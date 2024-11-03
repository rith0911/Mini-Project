import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        //username is the rollnumber
        rollnumber: {
            type: String,
            required: true,
            unique: true,
            minLength: 10,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        connections: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: [],
            }
        ],
        profileImg: {
            type: String,
            default: "",
        },
        coverImg: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: "",
        },
        link: {
            type: String,
            default: "",
        },
        projects: {
            type: String,
            default: "",
        },
        skills: [String],
        experience: [
            {
                title: String,
                project: String,
                startDate: Date,
                endDate: Date,
                description: String,
            }
        ],
        role:{
            type: String,
            enum: ['faculty' , 'student'],
            default: 'student'
        },
        headline: {
            type: String,
            default: 'CVR Member',
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;