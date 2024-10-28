import Group from "../models/group.model.js";
//import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const createGroup = async (req, res) => {
    const { name, description } = req.body;
    try {
        const group = new Group({ name, description, members: [req.user.id] });

        await group.save();

        res.status(201).json(group);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const joinLeaveGroup = async (req, res) => {
    const { id } = req.params;
    try {
        
        const group = await Group.findById(id);

        if (!group) {
            return res.status(400).json({ message: "Group not found" });
        }

        const member = group.members.includes(req.user._id);

        if (member) {
            //leave Group
            await Group.findByIdAndUpdate(id, { $pull: { members: req.user._id } });
            res.status(200).json({ message: "Group exited successfully" });
        } else {
            //join group
            await Group.findByIdAndUpdate(id, { $push: { members: req.user._id } });

            //send notification
            const newNotification = new Notification({
                type: 'follow',
                from: req.user._id,
                to: req.user._id,
            });

            await newNotification.save();

            res.status(200).json({ message: "Group joined successfully" });
        }
    } catch (error) {
        console.log("Error in joinLeaveGroup: ", error.message);
        res.status(500).json({error: error.message});
    }
};

