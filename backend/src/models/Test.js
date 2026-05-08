import mongoose from "mongoose";

    const TestShema = new mongoose.Schema(
    {
        title :
        {
            type: String,
            required: true,
            trim: true,
        },
        status : 
        {
            type: String,
            default: ["active", "complete"],
            default: "active"
        },
        completeAt :
        {
            type : Date,
            default: null
        }
    },
    {
        timestamps: true // Tự động thêm createdAt và updatedAt
    }
);

const Test = mongoose.model("Test", TestShema);
export default Test;