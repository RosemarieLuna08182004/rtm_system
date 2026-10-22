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
  Password: string;
  ProfilePhoto?: string | null;
  AccessToken?: string | null;
  Coins?: number;
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
