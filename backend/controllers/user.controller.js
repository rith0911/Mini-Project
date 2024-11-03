import bcrypt from 'bcryptjs';
import {v2 as cloudinary} from 'cloudinary';

//import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req,res)=>{
    const {rollnumber} = req.params; 
    try {
        const user = await User.findOne({rollnumber}).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile: ", error.message);
        res.status(500).json({error: error.message});
    }
};

// export const followUnfollowUser = async (req,res) =>{
//     try {
//         const {id} = req.params;
//         const userToModify = await User.findById(id);
//         const currentUser = await User.findById(req.user._id);

//         if(id === req.user._id.toString()){
//             return res.status(400).json({error: "You can't follow/unfollow yourself"});
//         }

//         if(!userToModify || !currentUser){
//             return res.status(400).json({error: "User not found"});
//         }

//         const isFollowing = currentUser.following.includes(id);

//         if(isFollowing){
//             //Unfollow User
//             await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id} });
//             await User.findByIdAndUpdate(req.user._id, {$pull: {following: id} });
//             res.status(200).json({message: "Unfollowed successfully"});
//         }else{
//             //follow user
//             await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
//             await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
//             //send notification
//             const newNotification = new Notification({
//                 type: 'follow',
//                 from: req.user._id,
//                 to: userToModify._id,
//             });

//             await newNotification.save();

//             res.status(200).json({message: "User followed successfully"});
//         }
//     } catch (error) {
//         console.log("Error in followUnfollowUser: ", error.message);
//         res.status(500).json({error: error.message});
//     }
// }

export const getSuggestedUsers = async (req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("connections");

        const suggestedUser = await User.find({
            _id: {
                $ne: req.user._id,
                $nin: user.connections,
            },
        })
        .select("name rollnumber profileImg headline")
        .limit(3);

        res.json(suggestedUser);
    } catch (error) {
        console.log("Error in getSuggestedUsers: ", error.message);
        res.status(500).json({ error: error.message});
    }
};

export const updateUser = async (req,res) => {
     const { name, email, rollnumber, currentPassword, newPassword, bio, link, projects, skills,experience, certifications, headline} = req.body;
     let {profileImg, coverImg} = req.body;

     const userId = req.user._id;
     
     try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});

        if((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({error: "Please provide both current password and new password"});
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) return res.status(400).json({error: "Current password is incorrect"});
            if(newPassword.length < 6){
                return res.status(400).json({error: "Password must be atleast 6 characters long"});
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if(profileImg) {

            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }

        if(coverImg){

            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.rollnumber = rollnumber || user.rollnumber;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.projects = projects || user.projects;
        user.skills = skills || user.skills;
        user.experience = experience || user.experience;
        user.certifications = certifications || user.certifications;
        user.headline = headline || user.headline;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password = null;

        return res.status(200).json(user);

     } catch (error) {
        console.log("Error in updateUser: ", error.message);
        res.status(500).json({error: error.message});
     }
};

// export const connecting = async (req,res) => {

//     const {id} = req.params;
//     try{
//         const reciever = await User.findById(id);
//         const sender = await User.findById(req.user.id);

//         if(!reciever || !sender) return res.status(404).json({message: 'User not found'});

//         reciever.connections.push(sender._id);
//         sender.connections.push(reciever._id);

//         await reciever.save();
//         await sender.save();

//         res.status(200).json({ message: 'Connection request sent'});

//     } catch(err){
//         res.status(500).json({error: err,message});
//     }
// };

// export const connectionReq = async (req,res) =>{
//     try {
//         const user = await User.findById(req.user.id).populate('connections', 'fullname department');

//         res.json(user.connections);
//     } catch (err) {
//         res.status(500).json({error: err.message});
//     }
// };

export const updateProfile = async (req, res) => {
	try {
		const allowedFields = [
			"name",
			"rollnumber",
			"headline",
			"bio",
			"profileImg",
			"coverImg",
			"skills",
			"experience",
		];

		const updatedData = {};

		for (const field of allowedFields) {
			if (req.body[field]) {
				updatedData[field] = req.body[field];
			}
		}

		if (req.body.profilePicture) {
			const result = await cloudinary.uploader.upload(req.body.profileImg);
			updatedData.profileImg = result.secure_url;
		}

		if (req.body.bannerImg) {
			const result = await cloudinary.uploader.upload(req.body.coverImg);
			updatedData.coverImg = result.secure_url;
		}

		const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select(
			"-password"
		);

		res.json(user);
	} catch (error) {
		console.error("Error in updateProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};