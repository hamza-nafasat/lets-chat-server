import mongoose from "mongoose";
import { cloudinarySchema } from "./utils.js";
import { genSalt, hash } from "bcrypt";

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        avatar: { type: cloudinarySchema },
    },
    { timestamps: true }
);

// pre save method for hashing password
userSchema.pre("save", async function (next) {
    let user = this;
    if (user.isModified("password")) {
        let salt = await genSalt(10);
        user.password = await hash(user.password, salt);
    }
    return next();
});

export const User = models.User || model("User", userSchema);
