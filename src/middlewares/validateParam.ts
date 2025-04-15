import { Request, Response, NextFunction } from "express";
import { ReasonStatusCode, StatusCode } from "./error.response";
const validateParamId = (req:Request, res:Response, next:NextFunction) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            status: ReasonStatusCode.BAD_REQUEST,
            code: StatusCode.BAD_REQUEST,
            message: "Id is required"
          });
    }
    next();
};
export default validateParamId