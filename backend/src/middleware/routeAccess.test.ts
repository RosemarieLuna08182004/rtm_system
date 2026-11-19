import "reflect-metadata";
import TokenHandler from "./tokenHandler";

// The storage controller creates a Google Cloud client on import; not needed here.
jest.mock("../services/storage/storageService", () => ({ __esModule: true, default: {} }));

/* eslint-disable @typescript-eslint/no-require-imports */
const controllers: Record<string, any> = {
  category: require("../controllers/setupControllers/categoryController").default,
  chapter: require("../controllers/setupControllers/chapterController").default,
  notification: require("../controllers/setupControllers/notificationController").default,
  product: require("../controllers/setupControllers/productController").default,
  term: require("../controllers/setupControllers/termController").default,
  termLine: require("../controllers/setupControllers/termLineController").default,
  user: require("../controllers/setupControllers/userController").default,
  userLine: require("../controllers/setupControllers/userLineController").default,
  userTerm: require("../controllers/transactionControllers/userTermController").default,
  storage: require("../controllers/storageController").StorageController,
};
/* eslint-enable @typescript-eslint/no-require-imports */

/** Middleware + handler registered for one route, read from the @Route metadata. */
const handlersFor = (controller: string, method: string, path: string): Function[] => {
  const routes = Reflect.getMetadata("routeHandlers", controllers[controller].prototype);
  const handlers = routes?.get(method)?.get(path);
  if (!handlers) throw new Error(`No route ${method.toUpperCase()} ${path} on ${controller}`);
  return handlers;
};

const isAdminOnly = (handlers: Function[]) =>
  handlers[0] === TokenHandler.verifyToken && handlers.includes(TokenHandler.verifyAdmin);

// Everything the web admin manages: must require an administrator.
const ADMIN_ONLY: Array<[string, string, string]> = [
  ["category", "delete", "/remove/:Id"], ["category", "post", "/add/"], ["category", "patch", "/update/:Id"],
  ["chapter", "delete", "/remove/:Id"], ["chapter", "post", "/add/"], ["chapter", "patch", "/update/:Id"],
  ["notification", "get", "/get/:Id"], ["notification", "get", "/get-all/"], ["notification", "get", "/get-all-by-user/"],
  ["notification", "patch", "/read/:Id"], ["notification", "patch", "/read-all/"], ["notification", "delete", "/remove/:Id"],
  ["product", "get", "/get/:Id"], ["product", "get", "/get-all/"], ["product", "delete", "/remove/:Id"], ["product", "post", "/add/"], ["product", "patch", "/update/:Id"],
  ["term", "delete", "/remove/:Id"], ["term", "post", "/add/"], ["term", "post", "/import-data/"], ["term", "post", "/import-rows/"], ["term", "patch", "/update/:Id"],
  ["termLine", "delete", "/remove/:Id"], ["termLine", "post", "/add/"], ["termLine", "patch", "/update/:Id"],
  ["user", "get", "/get-all/"], ["user", "delete", "/remove/:Id"],
  ["userLine", "get", "/get/:Id"], ["userLine", "get", "/get-all/"], ["userLine", "delete", "/remove/:Id"], ["userLine", "post", "/add/"], ["userLine", "patch", "/update/:Id"], ["userLine", "patch", "/update-condition/:UserId"],
  ["userTerm", "get", "/get/:Id"], ["userTerm", "get", "/get-all/"], ["userTerm", "post", "/add/"], ["userTerm", "patch", "/update/:Id"],
  ["storage", "post", "/term/:termId/illustration"], ["storage", "delete", "/term/:termId/illustration"],
];

// Called by the mobile app: any logged-in user, no admin check.
const MOBILE: Array<[string, string, string]> = [
  ["termLine", "get", "/get-all/:Id"],
  ["userTerm", "get", "/get-all-chapters/:UserId"], ["userTerm", "get", "/get-chapter/:Id/:UserId"],
  ["userTerm", "get", "/get-term/:Id/:UserId"], ["userTerm", "get", "/get-all-terms-by-chapter/:Id/:UserId"],
  ["userTerm", "post", "/bookmark/:TermId/:UserId"], ["userTerm", "patch", "/unbookmark/:Id"], ["userTerm", "delete", "/remove/:Id"],
];

describe("route access", () => {
  it.each(ADMIN_ONLY)("%s %s %s requires an administrator", (controller, method, path) => {
    expect(isAdminOnly(handlersFor(controller, method, path))).toBe(true);
  });

  it.each(MOBILE)("%s %s %s stays open to logged-in users", (controller, method, path) => {
    const handlers = handlersFor(controller, method, path);
    expect(handlers[0]).toBe(TokenHandler.verifyToken);
    expect(handlers).not.toContain(TokenHandler.verifyAdmin);
  });

  it.each([["get", "/get/:Id"], ["patch", "/update/:Id"]])("user %s %s is limited to your own account (or an admin)", (method, path) => {
    const handlers = handlersFor("user", method, path);
    expect(handlers[0]).toBe(TokenHandler.verifyToken);
    expect(handlers).toHaveLength(3); // verifyToken, verifySelfOrAdmin, handler
    expect(handlers).not.toContain(TokenHandler.verifyAdmin);
  });

  // Mobile routes that name a user or a bookmark record also check it belongs to the caller
  it.each([
    ["get", "/get-all-chapters/:UserId"], ["get", "/get-chapter/:Id/:UserId"], ["get", "/get-term/:Id/:UserId"],
    ["get", "/get-all-bookmark/:UserId/:ChapterId"], ["get", "/get-all-bookmark-chapter/:UserId"],
    ["get", "/get-all-terms-by-chapter/:Id/:UserId"], ["get", "/get-by-chapter/:userId/:chapterId"],
    ["post", "/bookmark/:TermId/:UserId"], ["patch", "/unbookmark/:Id"], ["delete", "/remove/:Id"],
  ])("userTerm %s %s checks ownership", (method, path) => {
    const handlers = handlersFor("userTerm", method, path);
    expect(handlers[0]).toBe(TokenHandler.verifyToken);
    expect(handlers).toHaveLength(3); // verifyToken, ownership check, handler
  });

  it("public sign-up stays open but never creates an administrator", async () => {
    const handlers = handlersFor("user", "post", "/add/");
    expect(handlers).toHaveLength(1); // no token check
    const { UserModel, NotificationModel } = require("../models"); // eslint-disable-line @typescript-eslint/no-require-imports
    const spy = jest.spyOn(UserModel, "add").mockResolvedValue({ data: true, message: "ok" });
    // Sign-up also records a notification; keep it away from the real database
    const notify = jest.spyOn(NotificationModel, "addNewUser").mockResolvedValue({ data: true, message: "ok" });
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    await handlers[0].call({}, { body: { AccountType: "administrator", Name: "Eve", Email: "eve@example.com", Password: "password123", Country: "PH" } }, res, jest.fn());
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ AccountType: "user" }));
    expect(notify).toHaveBeenCalledWith("eve@example.com", "Eve", "email");
    spy.mockRestore();
    notify.mockRestore();
  });
});
