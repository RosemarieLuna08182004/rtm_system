import { Id, Logs } from "../";

export interface UserLineTable extends Id, Logs {
  UserId?: number;
  Coins: number;
  IsBundle: boolean;
}

export const UserLineInitial: UserLineTable = {
  UserId: 0,
  Coins: 0,
  IsBundle: false,
};
