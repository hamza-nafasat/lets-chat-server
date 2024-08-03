import mongoose from "mongoose";

const { Schema, model, models, Types } = mongoose;

const tokenSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: "User", required: true },
        token: { type: String, required: true },
    },
    { timestamps: true }
);

export const Token = models.Token || model("Token", tokenSchema);
