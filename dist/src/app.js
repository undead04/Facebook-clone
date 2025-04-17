"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./configs/swagger");
const init_mongodb_1 = __importDefault(require("./databases/init.mongodb"));
const routes_1 = __importDefault(require("./routes"));
const error_response_1 = require("./middlewares/error.response");
const app = (0, express_1.default)();
// init middleware
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, compression_1.default)());
// init body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// init cors
app.use((0, cors_1.default)());
// Swagger documentation
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
//init db
init_mongodb_1.default;
// init route
app.use("/", routes_1.default);
// handling 404 errors
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.statusCode = error_response_1.StatusCode.NOT_FOUND;
    error.reasonStatusCode = error_response_1.ReasonStatusCode.NOT_FOUND;
    next(error);
});
// handling general errors
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const reasonStatusCode = error.reasonStatusCode || error_response_1.ReasonStatusCode.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
        status: reasonStatusCode,
        code: statusCode,
        stack: error.stack,
        message: error.message || "Internal Server Error",
        errors: error.errors || null,
    });
});
exports.default = app;
