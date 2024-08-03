import { User } from "../models/user.model.js";
import { createAndSetCookies, jwtService } from "../services/tokensServices.js";
import { CustomError, TryCatchHandler } from "./errorHandler.js";

const isAuthenticated = TryCatchHandler(async (req, res, next) => {
    const accessToken = req.cookies?.["lets-chat-a"];
    let userId;
    let user;
    if (accessToken) userId = await jwtService().verifyAccessToken(accessToken);
    if (!userId) {
        // get new access and refresh token
        const refreshToken = req.cookies?.["lets-chat-r"];
        if (!refreshToken) return next(new CustomError(400, "please Login again"));
        userId = await jwtService().verifyRefreshToken(refreshToken);
        user = await User.findById(userId);
        if (!user) return next(new CustomError(400, "please Login again"));
        const isSet = await createAndSetCookies(res, user);
        if (!isSet) return next(new CustomError(500, "Interval Server Error"));
    } else {
        // validate user
        user = await User.findById(userId);
        if (!user) return next(new CustomError(400, "please Login again"));
    }
    req.user = user;
    next();
});

export { isAuthenticated };
