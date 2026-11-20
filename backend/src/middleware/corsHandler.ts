import { Request, Response, NextFunction } from "express";

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => any;

// The Vite dev server and preview: only accepted when not running in production
const DEV_ORIGINS = [
  "http://127.0.0.1:4173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://localhost:5174",
];

export const corsHandler: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const allowedOrigins = [
    ...(process.env.NODE_ENV === "production" ? [] : DEV_ORIGINS),
    "http://anatomytermsmorphology.com",
    "https://anatomytermsmorphology.com",
    "http://www.anatomytermsmorphology.com",
    "https://www.anatomytermsmorphology.com",
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin))
    res.header("Access-Control-Allow-Origin", origin);
  res.header(
    "Access-Control-Allow-Headers",
    // Refresh-Token: the web admin sends it to renew a session (see /auth/refresh)
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Refresh-Token",
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
