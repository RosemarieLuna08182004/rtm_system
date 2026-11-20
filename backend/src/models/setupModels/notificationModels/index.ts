import { AddService, GetService, RemoveService, UpdateService } from "../../../services";
import { NotificationQuery, Error, Success, DBTable } from "../../../shared";
import { UserQuery } from "../../../shared/query/setup/userQuery";
import { ModelResponse } from "../../../types";

/** Status 1 = unread, 0 = read */
export const NotificationStatus = { unread: 1, read: 0 } as const;

const getAllModel = async (): Promise<ModelResponse> => {
  try {
    const response = await GetService.byQuery(NotificationQuery.q002);
    if (!response) return { data: [], message: Error.m011 };
    return { data: response, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("NotificationTable-Model [getAllModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};

const getModel = async (Id: number): Promise<ModelResponse> => {
  try {
    const response = await GetService.byFields(NotificationQuery.q001, ["Id"], [Number], [Id]);
    if (!response || response.length === 0) return { data: null, message: Error.m011 };
    return { data: response[0], message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("NotificationTable-Model [getModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: null, message: Error.m001 };
  }
};

const getAllByUserModel = async (UserId: number): Promise<ModelResponse> => {
  try {
    const response = await GetService.byFields(NotificationQuery.q003, ["UserId"], [Number], [UserId]);
    if (!response) return { data: [], message: Error.m011 };
    return { data: response, message: Success.m001 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("NotificationTable-Model [getAllByUserModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: [], message: Error.m001 };
  }
};

/**
 * Record an admin notification. Never throws: a failed notification must not
 * break the sign-up or payment that triggered it.
 * @param Description What happened, shown in the admin's list (max 255 chars)
 * @param Link Web admin route to open when clicked, e.g. "/a/user/d/43"
 * @param UserId The user the event is about (0 if none)
 */
const addModel = async (Description: string, Link: string = "", UserId: number = 0): Promise<ModelResponse> => {
  try {
    const added = await AddService.record(
      DBTable.t010,
      ["UserId", "Description", "LinkedComponent", "Status", "DateCreated"],
      [Number, String, String, Number, Date],
      [UserId || 0, Description.slice(0, 255), Link.slice(0, 100), NotificationStatus.unread, new Date()],
    );
    if (!added) return { data: false, message: Error.m003 };
    return { data: true, message: Success.m002 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("NotificationTable-Model [addModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};

/** "New user signed up" notification, linked to the new user's details page. Never throws. */
const addNewUserModel = async (Email: string, Name: string, Via: string = "email"): Promise<ModelResponse> => {
  try {
    const [user] = await GetService.byFields(UserQuery.q003, ["Email"], [String], [Email]);
    const Id = Number(user?.Id) || 0;
    return await addModel(`New user signed up with ${Via}: ${Name} (${Email})`, Id ? `/a/user/d/${Id}` : "/a/user", Id);
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("NotificationTable-Model [addNewUserModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};

const markReadModel = async (Id: number): Promise<ModelResponse> => {
  try {
    if (!Id || isNaN(Id)) return { data: false, message: Error.m005 };
    const existing = await GetService.byFields(NotificationQuery.q001, ["Id"], [Number], [Id]);
    if (!existing?.length) return { data: false, message: Error.m011 };
    await UpdateService.record(Id, DBTable.t010, ["Status", "DateUpdated"], [Number, Date], [NotificationStatus.read, new Date()]);
    return { data: true, message: Success.m004 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("NotificationTable-Model [markReadModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};

const markAllReadModel = async (): Promise<ModelResponse> => {
  try {
    const unread = await GetService.byFields(NotificationQuery.q004, ["Status"], [Number], [NotificationStatus.unread]);
    // The update helper treats "nothing changed" as an error, so skip it when all are read
    if (!unread?.length) return { data: true, message: Success.m004 };
    await UpdateService.condition(
      DBTable.t010, ["Status", "DateUpdated"], [Number, Date], [NotificationStatus.read, new Date()],
      "`Status` = ?", [NotificationStatus.unread],
    );
    return { data: true, message: Success.m004 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("NotificationTable-Model [markAllReadModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};

const removeModel = async (Id: number): Promise<ModelResponse> => {
  try {
    if (!Id || isNaN(Id)) return { data: false, message: Error.m005 };
    const existing = await GetService.byFields(NotificationQuery.q001, ["Id"], [Number], [Id]);
    if (!existing?.length) return { data: false, message: Error.m011 };
    await RemoveService.byId(Id, DBTable.t010);
    return { data: true, message: Success.m003 };
  } catch (error: any) {
    logging.log("----------------------------------------");
    logging.error("NotificationTable-Model [removeModel]:", error.message);
    logging.log("----------------------------------------");
    return { data: false, message: Error.m001 };
  }
};

class NotificationModel {
  get: typeof getModel;
  getAll: typeof getAllModel;
  getAllByUser: typeof getAllByUserModel;
  add: typeof addModel;
  addNewUser: typeof addNewUserModel;
  markRead: typeof markReadModel;
  markAllRead: typeof markAllReadModel;
  remove: typeof removeModel;

  constructor() {
    this.get = getModel;
    this.getAll = getAllModel;
    this.getAllByUser = getAllByUserModel;
    this.add = addModel;
    this.addNewUser = addNewUserModel;
    this.markRead = markReadModel;
    this.markAllRead = markAllReadModel;
    this.remove = removeModel;
  }
}

export default new NotificationModel();
