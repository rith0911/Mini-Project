import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
//import Departments from "../models/departments.model.js";

export const signup = async (req, res) => {
    try {
        const {name, rollnumber, email, password,role} = req.body;

        // const department = await Departments.findOne({name: departmentName})

        // const emailRegex = /^[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/i;

        // if(!emailRegex.test(email)){
        //     return res.status(400).json({error: "Invalid email format"});
        // }

        // const rollNumRegex = /[0-9]{2}[a-zA-Z]{1}[0-9]{2,}[a-zA-Z]{1,}[0-9A-Za-z]{4}$/;

        // const rollNumRegexF = /[a-zA-Z]{7}[0-9]{3}$/;

        // if(!rollNumRegex.test(rollnumber)){
        //     return res.status(400).json({error: "Invalid rollnumber format"});
        // }

        const existingUser = await User.findOne({ rollnumber });
        if(existingUser){
            return res.status(400).json({error: "RollNumber already registered"});
        }

        const existingEmail = await User.findOne({ email });
        if(existingEmail){
            return res.status(400).json({error: "Email already registered"});
        }

        if(!role){
            return res.status(400).json({success: false, message: 'Invalid role'});
        }

        if(password.length < 6){
            return res.status(400).json({error: "Password must be atleast 6 characters long"});
        }

        //hash password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            rollnumber,
            email,
            password: hashedPassword,
            //departmentId: department._id,
            role,
        });

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                rollnumber: newUser.rollnumber,
                email: newUser.email,
                // followers: newUser.followers,
                // following: newUser.following,
                connections: newUser.connections,
                role: newUser.role,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                projects: newUser.projects,
                skills: newUser.skills,
                //departmentId: newUser.departmentId,
                experience: newUser.experience,
                role: newUser.role,
            });
        }else{
            res.status(400).json({error: "Invalid user data"});
        }

    } catch (error) {
        console.log("Error in sign up controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const login = async (req, res) => {
    try {
        const {rollnumber, password} = req.body;
        const user = await User.findOne({rollnumber});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid rollnumber or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
                name: user.name,
                rollnumber: user.rollnumber,
                email: user.email,
                followers: user.followers,
                following: user.following,
                connections: user.connections,
                profileImg: user.profileImg,
                coverImg: user.coverImg,
                projects: user.projects,
                skills: user.skills,
                interestedDept: user.interestedDept,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt","",{maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getMe = async (req,res) =>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal server Error"});
    }
};