import { User } from "../models/user.model.js";
import { jwtService, sendTokens } from "../services/tokensServices.js";
import bcrypt from "bcrypt";
import { CustomError, TryCatchHandler } from "../middlewares/errorHandler.js";

// CREATE A USER
// ----------------------------------------------------
const registerNewUser = TryCatchHandler(async (req, res, next) => {
    const { name, username, password, bio } = req.body;
    const avatar = req.avatar;
    if (!name || !username || !password) {
        return next(new CustomError(400, "name, username,password are required"));
    }
    const user = await User.create({
        name,
        username,
        bio,
        password,
        avatar: {
            public_id: "default",
            url: "default",
        },
    });
    if (!user) return next(new CustomError(400, "error while creating a new user"));
    await sendTokens(res, user, 201, "User Created Successfully");
});
// LOGIN USER
// ----------------------------------------------------
const loginUser = TryCatchHandler(async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) return next(new CustomError(400, "username and password are required"));
    const user = await User.findOne({ username }).select("+password");
    if (!user) return next(new CustomError(400, "wrong username or password"));
    let isTrue = await bcrypt.compare(password, user.password);
    if (!isTrue) return next(new CustomError(400, "wrong username or password"));
    await sendTokens(res, user, 200, "You Are Successfully LoggedIn");
});
// GET MY PROFILE
// ----------------------------------------------------
const getMyProfile = TryCatchHandler(async (req, res, next) => {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    res.status(200).json({ success: true, data: user });
});

// GET NEW ACCESS TOKEN
// ----------------------------------------------------
const getNewAccessToken = TryCatchHandler(async (req, res, next) => {
    const refreshToken = req.cookies?.["lets-chat-r"];
    if (!refreshToken) return next(new CustomError(400, "please Login again"));
    // verify token and find user
    const userId = await jwtService().verifyRefreshToken(refreshToken);
    if (!userId) return next(new CustomError(400, "please Login again"));
    const user = await User.findById(userId);
    if (!user) return next(new CustomError(400, "please Login again"));
    // send cookies if all is well
    await sendTokens(res, user, 201, "New Token Sent Successfully");
});

export { registerNewUser, loginUser, getMyProfile, getNewAccessToken };
