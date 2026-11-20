import { Id, Logs } from "../";

export enum Roles {
  admin = "administrator",
  encoder = "encoder",
  moderator = "moderator",
  user = "user",
}

export interface UserTable extends Id, Logs {
  AccountType: Roles;
  GoogleId?: string | null;
  Name: string;
  Email: string;
  /** Two-letter code (PH, US, ...); null for accounts made before it was asked */
  Country?: string | null;
  Password: string;
  ProfilePhoto?: string | null;
  AccessToken?: string | null;
  IsBundle?: number;
  UserLineId?: number;
}

export const UserInitial: UserTable = {
  AccountType: Roles.user,
  GoogleId: null,
  Name: "",
  Email: "",
  Password: "",
  ProfilePhoto: null,
  AccessToken: null,
};
