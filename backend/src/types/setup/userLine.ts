import { Id, Logs } from "../";

export interface UserLineTable extends Id, Logs {
  UserId?: number;
  IsBundle: boolean;
}

export const UserLineInitial: UserLineTable = {
  UserId: 0,
  IsBundle: false,
};
