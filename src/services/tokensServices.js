import jwt from "jsonwebtoken";
import getEnv from "../configs/getEnv.js";
import { Token } from "../models/token.model.js";
import { decryptPayload, encryptPayload } from "../utils/encryption.js";

// factory function for jwt tokens
// ------------------------------
const jwtService = () => {
    return {
        // Access token : create and encrypt
        getAccessToken: async (_id) => {
            try {
                if (!_id) throw new Error("_id is not provided in get access token");
                let token = await jwt.sign({ _id }, getEnv("ACCESS_TOKEN_SECRET"), {
                    expiresIn: Number(getEnv("ACCESS_TOKEN_EXPIRY")),
                });
                token = await encryptPayload(token);
                return token;
            } catch (error) {
                console.log("error while creating and encrypting access token", error);
                return null;
            }
        },
        // Access token ; decrypt and decode
        verifyAccessToken: async (token) => {
            try {
                if (!token) throw new Error("Token Not Provided in verifyAccessToken ");
                let decryptedToken = await decryptPayload(token);
                const decodedToken = await jwt.verify(decryptedToken, getEnv("ACCESS_TOKEN_SECRET"));
                if (decodedToken._id) return decodedToken._id;
                else return null;
            } catch (error) {
                console.log("error while verifying access token ", error);
                return null;
            }
        },

        // Refresh token : create, encrypt and store in database
        getRefreshToken: async (_id) => {
            try {
                if (!_id) throw new Error("_id is not provided in get refresh token");
                let token = await jwt.sign({ _id }, getEnv("REFRESH_TOKEN_SECRET"), {
                    expiresIn: Number(getEnv("REFRESH_TOKEN_EXPIRY")),
                });
                let [encryptedToken, storedToken] = await Promise.all([
                    encryptPayload(token),
                    Token.findOneAndUpdate({ userId: _id }, { token }, { upsert: true, new: true }),
                ]);
                if (!storedToken) throw new Error("Error While Storing Refresh Token in DB");
                return encryptedToken;
            } catch (error) {
                console.log("error while creating and encrypting refresh token", error);
                return null;
            }
        },
        // Refresh token : decrypt, check in db and decode
        verifyRefreshToken: async (token) => {
            try {
                if (!token) throw new Error("Token Not Provided in verifyRefreshToken ");
                const decryptedToken = await decryptPayload(token);
                const decodedToken = await jwt.verify(decryptedToken, getEnv("REFRESH_TOKEN_SECRET"));
                let userId = decodedToken?._id;
                if (userId) {
                    const deleteOldToken = await Token.findOneAndDelete({ userId }, { token }, { new: true });
                    if (deleteOldToken) return userId;
                } else return null;
            } catch (error) {
                console.log("error while verifying refresh token", error);
                return null;
            }
        },
    };
};
// create and set cookies
// ----------------------
const createAndSetCookies = async (res, user) => {
    try {
        const cookieOptions = { httpOnly: true, sameSite: "none", secure: true };
        const [accessToken, refreshToken] = await Promise.all([
            jwtService().getAccessToken(user._id),
            jwtService().getRefreshToken(user._id),
        ]);
        if (!accessToken || !refreshToken) throw new Error("Internal Server Error");
        res.cookie("lets-chat-a", accessToken, { ...cookieOptions, maxAge: getEnv("ACCESS_TOKEN_EXPIRY") });
        res.cookie("lets-chat-r", refreshToken, { ...cookieOptions, maxAge: getEnv("REFRESH_TOKEN_EXPIRY") });
        return true;
    } catch (error) {
        console.log("error while creating and setting cookies ", error);
        return null;
    }
};
// function for sending token in client side
// ----------------------------------------
const sendTokens = async (res, user, code, message) => {
    if (!user) {
        console.log("User Not Provided in sendToken Function");
        throw new Error("Internal Server Error");
    }
    const isSetCookies = await createAndSetCookies(res, user);
    if (!isSetCookies) throw new Error("Interval Server Error");
    res.status(Number(code)).json({ success: true, message, user });
};

export { jwtService, sendTokens, createAndSetCookies };
