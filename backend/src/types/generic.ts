import { Request, Response } from "express";
import { UserTable } from "./setup";

export interface Id {
  Id?: string;
}

export interface Logs {
  CreatedBy?: number;
  DateCreated?: Date;
  UpdatedBy?: number | null;
  DateUpdated?: Date | null;
}

export enum Status {
  lock = "lock",
  unlock = "unlock",
  bookmark = "bookmark",
  unbookmark = "unbookmark",
}

export interface LoginRequest extends Request {
  User?: UserTable;
  AccessToken?: string;
  RefreshToken?: string;
  /** Caller's account, set by TokenHandler.verifyAdmin / verifySelfOrAdmin */
  CurrentUser?: Pick<UserTable, "Id" | "AccountType" | "Email">;
}

export interface ModelResponse {
  data: any;
  message: string;
}
