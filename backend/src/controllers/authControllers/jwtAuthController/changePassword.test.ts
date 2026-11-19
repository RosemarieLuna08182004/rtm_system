import "reflect-metadata";
import { hashSync, compareSync } from "bcrypt";
import AuthController from ".";
import { GetService, UpdateService } from "../../../services";
import { TokenHandler, loginLimiter } from "../../../middleware";

jest.mock("../../../services", () => ({
  GetService: { byFields: jest.fn() },
  UpdateService: { record: jest.fn() },
}));

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
    (GetService.byFields as jest.Mock).mockImplementation(async (_q: string, fields: string[]) =>
      fields[0] === "Email" ? [{ Id: 125 }] : [{ Id: 16, Password: hashSync(CURRENT, 4) }]);
    (UpdateService.record as jest.Mock).mockResolvedValue(true);
  });
  afterEach(() => jest.clearAllMocks());

  it("requires a login and is rate-limited", () => {
    expect(routes()[0]).toBe(TokenHandler.verifyToken);
    expect(routes()).toContain(loginLimiter);
  });

  it("changes the password when the current one is right, storing only a hash", async () => {
    expect((await change({ CurrentPassword: CURRENT, NewPassword: "New-password-2" })).status).toBe(200);
    const [id, , fields, , values] = (UpdateService.record as jest.Mock).mock.calls[0];
    expect(id).toBe(16);
    expect(fields).toEqual(["Password", "DateUpdated"]);
    expect(values[0]).not.toBe("New-password-2");
    expect(compareSync("New-password-2", values[0])).toBe(true);
  });

  it("refuses a wrong current password", async () => {
    expect((await change({ CurrentPassword: "wrong-guess", NewPassword: "New-password-2" })).status).toBe(401);
    expect(UpdateService.record).not.toHaveBeenCalled();
  });

  it("finds Google-login users by their email", async () => {
    await change({ CurrentPassword: CURRENT, NewPassword: "New-password-2" }, { email: "ann@example.com" });
    expect((GetService.byFields as jest.Mock).mock.calls[0][3]).toEqual(["ann@example.com"]);
  });

  it.each([
    [{ CurrentPassword: CURRENT, NewPassword: "short" }],
    [{ CurrentPassword: CURRENT, NewPassword: CURRENT }],
    [{ NewPassword: "New-password-2" }],
  ])("rejects invalid input: %p", async (body) => {
    expect((await change(body)).status).toBe(400);
    expect(UpdateService.record).not.toHaveBeenCalled();
  });
});
