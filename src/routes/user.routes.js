import express from "express";
import { getMyProfile, loginUser, registerNewUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/authorization.js";
import { singleAvatar } from "../middlewares/multer.js";

const app = express.Router();

app.post("/register", singleAvatar, registerNewUser);
app.post("/login", loginUser);

app.get("/my-profile", isAuthenticated, getMyProfile);

export default app;
