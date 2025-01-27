import mongoose, { Schema } from "mongoose";

const equipmentSchema = new Schema({
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

const Equipment = mongoose.model("Equipment", equipmentSchema);
export default Equipment;
