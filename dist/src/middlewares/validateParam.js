"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = require("./error.response");
const validateParamId = (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            status: error_response_1.ReasonStatusCode.BAD_REQUEST,
            code: error_response_1.StatusCode.BAD_REQUEST,
            message: "Id is required"
        });
    }
    next();
};
exports.default = validateParamId;
