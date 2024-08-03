import { Schema } from "mongoose";

export const cloudinarySchema = new Schema({
    public_id: { type: String, required: true },
    url: { type: String, required: true },
});
