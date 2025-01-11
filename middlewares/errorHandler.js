import "dotenv/config";
import Joi from "joi";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
const { ValidationError } = Joi;


const errorHandler = (error, req, res, next) => {

    let statusCode = 500;
    let data = {
        message: "Internal server error",
        ...(process.env.DEBUG_MODE === "true" && { orignalError: error.message })
    }

    if (error instanceof ValidationError) {
        statusCode = 422;
        data = {
            message: error.message
        }
    };

    if(error instanceof CustomErrorHandler){
        statusCode = error.status;
        data = {
            message:error.message,
        }
    };

    return res.status(statusCode).json(data);

};

export default errorHandler;