import { Request, Response, NextFunction } from "express";

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => any;

export const corsHandler: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const allowedOrigins = [
    "http://127.0.0.1:4173",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://anatomytermsmorphology.com",
    "https://anatomytermsmorphology.com",
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin))
    res.header("Access-Control-Allow-Origin", origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.path.includes("/favicon.ico")) return res.status(204).end();
  next();
};
