import { Id, Logs, Status } from "../";

export interface UserTermsTable extends Id, Logs {
  UserId?: number;
  ChapterId?: number | null;
  TermId?: number | null;
  Status: number;
}

export const UserTermsInitial: UserTermsTable = {
  UserId: 0,
  ChapterId: null,
  TermId: null,
  Status: 0,
};
