import { NextFunction, Request, Response } from "express";

const asyncHandle = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
};

export default asyncHandle;
