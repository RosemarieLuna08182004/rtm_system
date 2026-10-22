import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { GetService } from "../services";
import { Error } from "../shared/messages";
import { LoginRequest, Roles } from "../types";

// Roles that may manage learning content (chapters, terms, categories, illustrations).
export const STAFF_ROLES: Roles[] = [Roles.admin, Roles.encoder];

const ROLE_QUERY = "SELECT `Id`, `AccountType` FROM `user` WHERE `Id` = ?";

const forbidden = (res: Response) =>
  res.status(403).json({ data: false, message: Error.m034 });

// The authenticated user's Id, taken only from the verified token.
export const getAuthUserId = (req: LoginRequest): number => {
  const id = Number((req.User as any)?.Id);
  return Number.isInteger(id) && id > 0 ? id : 0;
};

// Looks up (and caches on the request) the caller's AccountType from the database,
// so a role change takes effect without waiting for tokens to expire.
export const getAuthRole = async (req: LoginRequest): Promise<Roles | null> => {
  const cached = (req as any).AuthRole;
  if (cached !== undefined) return cached;
  const id = getAuthUserId(req);
  let role: Roles | null = null;
  if (id) {
    const rows = await GetService.byFields(ROLE_QUERY, ["Id"], [Number], [id]);
    role = (rows?.[0]?.AccountType as Roles) ?? null;
  }
  (req as any).AuthRole = role;
  return role;
};

export const isAdmin = async (req: LoginRequest): Promise<boolean> =>
  (await getAuthRole(req)) === Roles.admin;

// Owner of the resource, or an administrator.
export const canAccessUser = async (req: LoginRequest, userId: number): Promise<boolean> => {
  const authId = getAuthUserId(req);
  if (!authId) return false;
  if (authId === userId) return true;
  return isAdmin(req);
};

// Middleware: caller must have one of the given roles. Use after TokenHandler.verifyToken.
export const requireRoles =
  (...roles: Roles[]) =>
  async (req: LoginRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const role = await getAuthRole(req);
      if (!role || !roles.includes(role)) return forbidden(res);
      next();
    } catch (error: any) {
      logging.error("Authorize [requireRoles]:", error.message);
      return forbidden(res);
    }
  };

// Middleware: route param `param` must be the caller's own user Id (administrators may access any).
export const requireSelf =
  (param: string = "UserId") =>
  async (req: LoginRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = parseInt(`${req.params?.[param]}`, 10);
      if (!Number.isInteger(userId) || !(await canAccessUser(req, userId)))
        return forbidden(res);
      next();
    } catch (error: any) {
      logging.error("Authorize [requireSelf]:", error.message);
      return forbidden(res);
    }
  };

// For routes without TokenHandler (e.g. public registration): returns the caller's
// role when a valid bearer token is present, otherwise null.
export const getOptionalRole = async (req: LoginRequest): Promise<Roles | null> => {
  const header = req.headers["authorization"];
  if (!header || !header.startsWith("Bearer ")) return null;
  try {
    const payload: any = jwt.verify(header.split(" ")[1], SECRET_KEY);
    if (payload?.type === "refresh") return null;
    req.User = payload;
    return await getAuthRole(req);
  } catch {
    return null;
  }
};
