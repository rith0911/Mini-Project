import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // username: {
        //     type: String,
        //     required: true,
        //     unique: true,
        // },
        fullname: {
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
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: []
            }
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: []
            }
        ],
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
        experience: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: []
            }
        ],
        skills: {
            type: String,
            default: "",
        },
        department: {
            type: String,
            required: true,
        },
        certifications: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;