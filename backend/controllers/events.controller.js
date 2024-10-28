import Event from "../models/events.model.js";
//import Notification from "../models/notification.model.js";

export const createEvent = async(req,res) =>{
    const {name , descripiton, date} = req.body;
    try {
        const event = new Event({name, descripiton, date, organiser: req.user.fullname});
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export const attendEvent = async (req,res) =>{
    const {id} = req.params;
    try {
        const event = await Event.findById(id);

        event.attendees.push(req.user._id);

        await event.save();

        // const newNotification = new Notification({
        //     type: 'event',
        //     from: req.user._id,
        //     to: event.organizer.id,
        // });

        //await newNotification.save();

        res.json(event);
    } catch (error) {
        console.log('Error in attendEvent controller: ', error.message);
        res.status(500).json({error: error.message});
    }
};