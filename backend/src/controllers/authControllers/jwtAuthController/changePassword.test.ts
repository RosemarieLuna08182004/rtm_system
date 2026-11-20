import "reflect-metadata";
import { hashSync } from "bcrypt";
import { GetService } from "../../../services";
import { UserModel } from "../../../models";
import { authLimiter, TokenHandler } from "../../../middleware";

jest.mock("../../../services", () => ({ GetService: { byFields: jest.fn() }, UpdateService: { record: jest.fn() } }));
jest.mock("../../../models", () => ({ UserModel: { update: jest.fn() } }));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const AuthController = require(".").default;
const CURRENT = "Old-password-1";
const routes = () => Reflect.getMetadata("routeHandlers", AuthController.prototype).get("post").get("/change-password");

/** Runs the validated handler as a logged-in user */
const change = async (body: any, user: any = { Id: 16 }) => {
  const handler = routes().slice(-1)[0];
  const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
  await handler.call(new AuthController(), { body, User: user }, res, jest.fn());
  return { status: res.status.mock.calls[0][0], body: res.json.mock.calls[0][0] };
};

describe("POST /auth/change-password", () => {
  beforeEach(() => {
    (GetService.byFields as jest.Mock).mockResolvedValue([{ Id: 16, Password: hashSync(CURRENT, 4) }]);
    (UserModel.update as jest.Mock).mockResolvedValue({ data: true, message: "ok" });
  });
  afterEach(() => jest.clearAllMocks());

  it("requires a login and is rate-limited", () => {
    expect(routes()).toContain(TokenHandler.verifyToken);
    expect(routes()).toContain(authLimiter);
  });

  it("changes the signed-in user's password when the current one is right", async () => {
    expect((await change({ CurrentPassword: CURRENT, NewPassword: "New-password-2" })).status).toBe(200);
    expect((GetService.byFields as jest.Mock).mock.calls[0][3]).toEqual([16]);
    // The model hashes the password before saving it.
    expect(UserModel.update).toHaveBeenCalledWith(16, { Password: "New-password-2" });
  });

  it("refuses a wrong current password", async () => {
    expect((await change({ CurrentPassword: "wrong-guess", NewPassword: "New-password-2" })).status).toBe(401);
    expect(UserModel.update).not.toHaveBeenCalled();
  });

  it.each([
    [{ CurrentPassword: CURRENT, NewPassword: "short" }],
    [{ CurrentPassword: CURRENT, NewPassword: CURRENT }],
    [{ NewPassword: "New-password-2" }],
  ])("rejects invalid input: %p", async (body) => {
    expect((await change(body)).status).toBe(400);
    expect(UserModel.update).not.toHaveBeenCalled();
  });
});
