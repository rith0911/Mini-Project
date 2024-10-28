import Mentorship from "../models/mentorship.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const mentorReq = async (req,res) =>{
    const {mentorId} = req.body;

    try {
        const mentor = await User.findById(mentorId);
        const mentorship = new Mentorship({
            mentor: mentorId,
            mentee: req.user._id,
        });

        await mentorship.save();

        const newNotification = new Notification({
            type: 'mentor',
            from: req.user._id,
            to: mentor._id,
        });

        await newNotification.save();

        res.json({success:true, message: "Mentorship request sent!"});
    } catch (error) {
        console.log('Error in mentorReq controller: ', error.message);
        res.status(500).json({error: error.message});
    }
}

// export const mentorshipList = async (req,res) =>{
//     try{
//         const mentorships = await Mentorship.find({
//             mentee: req.user._id
//         }).populate('mentor', 'name');

//         res.json(mentorships);
//     } catch(error){
//         console.log("error in mentorshipsList controller: ", error.message);
//         res.status(500).json({ error: error.message});
//     }
// };

export const mentorshipList = async (req,res) =>{
    try{
        const mentorship = await Mentorship.find().populate('mentor', 'name').populate('mentee', 'name');

        res.json({success: true, mentorship});
    } catch(error){
        res.status(500).json({message: 'Server error', error});
    }
};