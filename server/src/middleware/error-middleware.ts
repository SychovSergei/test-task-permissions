import { NextFunction, Request, Response } from "express";

import ApiError from "../errors/api-error";

export default function (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  console.error("err.stack === ", err.stack);
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ code: err.code, message: err.message });
  }
  return res.status(500).json({ message: "Unknown error" });
}
