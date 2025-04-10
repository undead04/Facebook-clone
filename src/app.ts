import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import instanceMongodb from "./databases/init.mongodb";
import router from "./routes";
import { ReasonStatusCode, StatusCode } from "./middlewares/error.response";
const app = express();
// init middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

// init body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init cors
app.use(cors());

//init db
instanceMongodb;

// init route
app.use("/", router);

// handling 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error("Not Found");
  error.statusCode = StatusCode.NOT_FOUND;
  error.reasonStatusCode = ReasonStatusCode.NOT_FOUND;
  next(error);
});

// handling general errors
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const reasonStatusCode =
    error.reasonStatusCode || ReasonStatusCode.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    status: reasonStatusCode,
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
    errors: error.errors || null,
  });
});

export default app;
