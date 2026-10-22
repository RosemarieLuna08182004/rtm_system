import { Request, Response, NextFunction } from "express";

export function route404(req: Request, res: Response, next: NextFunction) {
  const error = new Error("Not found");
  logging.warning(error.message);

  res.status(404).json({
    error: {
      message: error.message,
    },
  });
}
