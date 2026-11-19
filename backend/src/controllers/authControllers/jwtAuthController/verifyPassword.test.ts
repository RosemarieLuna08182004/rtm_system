import "reflect-metadata";
import { compare } from "bcrypt";
import { GetService } from "../../../services";

jest.mock("../../../services", () => ({ GetService: { byFields: jest.fn() }, UpdateService: { record: jest.fn() } }));
jest.mock("bcrypt", () => ({ compare: jest.fn(), hash: jest.fn() }));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const AuthController = require(".").default;
const handler = () => {
  const handlers = Reflect.getMetadata("routeHandlers", AuthController.prototype).get("post").get("/verify-password");
  return handlers[handlers.length - 1];
};
const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("POST /auth/verify-password", () => {
  afterEach(() => jest.clearAllMocks());

  it("checks the signed-in account, ignoring any Email sent with the request", async () => {
    (GetService.byFields as jest.Mock)
      .mockResolvedValueOnce([{ Id: 43 }])                         // caller from the token
      .mockResolvedValueOnce([{ Id: 43, Password: "hash-of-43" }]); // their stored hash
    (compare as jest.Mock).mockResolvedValue(true);
    const res = mockRes();
    await handler().call({}, { User: { Id: 43 }, body: { Email: "someone-else@example.com", Password: "secret" } }, res, jest.fn());
    expect((GetService.byFields as jest.Mock).mock.calls[0][3]).toEqual([43]);
    expect(compare).toHaveBeenCalledWith("secret", "hash-of-43");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("refuses a wrong or missing password", async () => {
    (GetService.byFields as jest.Mock).mockResolvedValueOnce([{ Id: 43 }]).mockResolvedValueOnce([{ Id: 43, Password: "h" }]);
    (compare as jest.Mock).mockResolvedValue(false);
    const res = mockRes();
    await handler().call({}, { User: { Id: 43 }, body: { Password: "wrong" } }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
