import "reflect-metadata";
import jwt from "jsonwebtoken";
import { getRefreshUserId } from "./index";
import { SECRET_KEY, SECRET_REFRESH_KEY } from "../../../config";

jest.mock("../../../services", () => ({
  GetService: { byFields: jest.fn() },
}));

const req = (opts: { body?: any; headers?: Record<string, string> }) =>
  ({ body: opts.body ?? {}, headers: opts.headers ?? {} }) as any;

describe("refresh credential resolution", () => {
  it("accepts a valid refresh token in the body", () => {
    const token = jwt.sign({ UserId: 7, type: "refresh" }, SECRET_REFRESH_KEY, { expiresIn: "1h" });
    expect(getRefreshUserId(req({ body: { refreshToken: token } }))).toBe(7);
  });

  it("accepts a valid refresh token in the Refresh-Token header (web admin)", () => {
    const token = jwt.sign({ UserId: 3 }, SECRET_REFRESH_KEY, { expiresIn: "1h" });
    expect(getRefreshUserId(req({ headers: { "refresh-token": token } }))).toBe(3);
  });

  it("works even when the access token has expired", () => {
    const refresh = jwt.sign({ UserId: 7 }, SECRET_REFRESH_KEY, { expiresIn: "1h" });
    const expiredAccess = jwt.sign({ Id: 7 }, SECRET_KEY, { expiresIn: -10 });
    expect(
      getRefreshUserId(req({ body: { refreshToken: refresh }, headers: { authorization: `Bearer ${expiredAccess}` } })),
    ).toBe(7);
  });

  it("rejects a refresh token signed with the wrong key", () => {
    const token = jwt.sign({ UserId: 7 }, "not-the-key", { expiresIn: "1h" });
    expect(getRefreshUserId(req({ body: { refreshToken: token } }))).toBe(0);
  });

  it("rejects an expired refresh token", () => {
    const token = jwt.sign({ UserId: 7 }, SECRET_REFRESH_KEY, { expiresIn: -10 });
    expect(getRefreshUserId(req({ body: { refreshToken: token } }))).toBe(0);
  });

  it("supports older app builds that send a still-valid access token", () => {
    const access = jwt.sign({ Id: 9 }, SECRET_KEY, { expiresIn: "1h" });
    expect(getRefreshUserId(req({ headers: { authorization: `Bearer ${access}` } }))).toBe(9);
  });

  it("rejects an expired access token without a refresh token", () => {
    const access = jwt.sign({ Id: 9 }, SECRET_KEY, { expiresIn: -10 });
    expect(getRefreshUserId(req({ headers: { authorization: `Bearer ${access}` } }))).toBe(0);
  });

  it("returns 0 with no credentials", () => {
    expect(getRefreshUserId(req({}))).toBe(0);
  });
});
