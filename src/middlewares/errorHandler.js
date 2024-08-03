import createHttpError from "http-errors";

// middleware
const Errorhandler = (err, req, res, next) => {
    console.log(err);
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

// try catch handler
const TryCatchHandler = (func) => async (req, res, next) => {
    try {
        return await func(req, res, next);
    } catch (error) {
        next(createHttpError(500, error.message));
    }
};

// error custom class
class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode || 500;
        this.message = message || "Interval Server Error";
    }
}

export { Errorhandler, TryCatchHandler, CustomError };
