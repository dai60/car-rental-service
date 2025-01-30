import mongoose, { Schema } from "mongoose";

const reservationSchema = new Schema({
    equipment: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Equipment",
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    date: {
        start: {
            type: Date,
            required: true,
        },
        end: {
            type: Date,
        }
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "ready"],
        default: "pending",
    }
}, { timestamps: true });

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;
