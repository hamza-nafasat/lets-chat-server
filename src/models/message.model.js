import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const messageSchema = new Schema(
    {
        content: { type: String },
        attachments: [{ type: cloudinarySchema }],
        sender: { type: Types.ObjectId, ref: "User", required: true },
        chat: { type: Types.ObjectId, ref: "Chat", required: true },
    },
    { timestamps: true }
);

export const Message = models.Message || model("Message", messageSchema);
