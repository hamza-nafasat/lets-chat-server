import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import { Errorhandler } from "./middlewares/errorHandler.js";

export const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// add routes
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => res.send("Hello World!"));

app.use(Errorhandler);
