import "reflect-metadata";
import axios from "axios";
import OAuthController from ".";
import { GetService, UpdateService } from "../../../services";

jest.mock("axios", () => ({ __esModule: true, default: { post: jest.fn(), get: jest.fn() } }));
jest.mock("../../../services", () => ({
  GetService: { byFields: jest.fn() },
  UpdateService: { record: jest.fn() },
}));

const CLIENT_ID = "rtm-client-id";

/** Calls POST /auth/refresh-google/:Id through the registered route handler */
const refresh = async (Id: string, body: any) => {
  const routes = Reflect.getMetadata("routeHandlers", OAuthController.prototype);
  const [handler] = routes.get("post").get("/refresh-google/:Id").slice(-1);
  const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
  await handler.call(new OAuthController(), { params: { Id }, body }, res, jest.fn());
  return { status: res.status.mock.calls[0][0], body: res.json.mock.calls[0][0] };
};

describe("POST /auth/refresh-google/:Id", () => {
  beforeAll(() => { process.env.GOOGLE_CLIENT_ID = CLIENT_ID; });
  beforeEach(() => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { access_token: "new-google-token" } });
    (axios.get as jest.Mock).mockResolvedValue({ data: { aud: CLIENT_ID, email: "Ann@Example.com" } });
    (GetService.byFields as jest.Mock).mockResolvedValue([{ Id: 125, Email: "ann@example.com" }]);
    (UpdateService.record as jest.Mock).mockResolvedValue(true);
  });
  afterEach(() => jest.clearAllMocks());

  it("refreshes and stores the token for the account's own Google login", async () => {
    const result = await refresh("125", { refreshToken: "ann-refresh" });
    expect(result).toEqual({ status: 200, body: expect.objectContaining({ data: "new-google-token" }) });
    expect(UpdateService.record).toHaveBeenCalledWith(125, expect.anything(), ["AccessToken", "DateUpdated"], expect.anything(), ["new-google-token", expect.any(Date)]);
  });

  it("refuses to store someone else's Google token on this account", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { aud: CLIENT_ID, email: "attacker@example.com" } });
    expect((await refresh("125", { refreshToken: "attacker-refresh" })).status).toBe(403);
    expect(UpdateService.record).not.toHaveBeenCalled();
  });

  it("refuses a token issued to a different app", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { aud: "some-other-app", email: "ann@example.com" } });
    expect((await refresh("125", { refreshToken: "ann-refresh" })).status).toBe(403);
    expect(UpdateService.record).not.toHaveBeenCalled();
  });

  it("refuses an unknown user id", async () => {
    (GetService.byFields as jest.Mock).mockResolvedValue([]);
    expect((await refresh("999", { refreshToken: "ann-refresh" })).status).toBe(403);
    expect(UpdateService.record).not.toHaveBeenCalled();
  });

  it("answers 401 when Google rejects the refresh token", async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error("invalid_grant"));
    expect((await refresh("125", { refreshToken: "fake" })).status).toBe(401);
    expect(UpdateService.record).not.toHaveBeenCalled();
  });

  it.each([[{}], [{ refreshToken: 123 }], [undefined]])("answers 400 for a missing refresh token: %p", async (body) => {
    expect((await refresh("125", body)).status).toBe(400);
    expect(axios.post).not.toHaveBeenCalled();
  });
});
