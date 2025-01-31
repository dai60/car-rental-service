import mongoose, { Schema } from "mongoose";

const carSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    visibility: {
        type: String,
        enum: ["draft", "public"],
        default: "draft",
    },
}, { timestamps: true });

const Car = mongoose.model("Car", carSchema);
export default Car;
