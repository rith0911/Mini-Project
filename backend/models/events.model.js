import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        date:{
            type: Date,
            required: true,
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        attendees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
    }
);

const Event = mongoose.model("Events", EventSchema);

export default Event;