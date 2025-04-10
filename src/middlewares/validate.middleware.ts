import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "./error.response"; // bạn tự định nghĩa lỗi này

export const validateBody = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObject, { whitelist: true });

    if (errors.length > 0) {
      const formattedErrors = errors.map((err) => ({
        field: err.property,
        errors: Object.values(err.constraints || {}),
      }));
      throw new BadRequestError("Validation failed", formattedErrors);
    }

    req.body = dtoObject;
    next();
  };
};
