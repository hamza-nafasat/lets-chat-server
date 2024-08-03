import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const requestSchema = new Schema(
    {
        status: { type: String, default: "pending", enum: ["pending", "accepted", "rejected"] },
        sender: { type: Types.ObjectId, ref: "User", required: true },
        receivers: { type: Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const Request = models.Request || model("Request", requestSchema);
