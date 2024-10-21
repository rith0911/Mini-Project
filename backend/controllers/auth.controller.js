import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const {fullname, rollnumber, email, password} = req.body;

        const emailRegex = /^[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/i;


        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid email format"});
        }

        const rollNumRegex = /[0-9]{2}[a-zA-Z]{1}[0-9]{2,}[a-zA-Z]{1,}[0-9A-Za-z]{4}$/;

        if(!rollNumRegex.test(rollnumber)){
            return res.status(400).json({error: "Invalid rollnumber format"});
        }


        const existingUser = await User.findOne({ rollnumber });
        if(existingUser){
            return res.status(400).json({error: "Username already registered"});
        }

        const existingEmail = await User.findOne({ email });
        if(existingEmail){
            return res.status(400).json({error: "Email already registered"});
        }

        if(password.length < 6){
            return res.status(400).json({error: "Password must be atleast 6 characters long"});
        }

        //hash password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            rollnumber,
            email,
            password: hashedPassword,
        });

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                rollnumber: newUser.rollnumber,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                projects: newUser.projects,
                skills: newUser.skills,
                interestedDept: newUser.interestedDept,
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
                fullname: user.fullname,
                rollnumber: user.rollnumber,
                email: user.email,
                followers: user.followers,
                following: user.following,
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