import { requireRoles, requireSelf, canAccessUser } from "./authorize";
import { GetService } from "../services";
import { Roles } from "../types";

jest.mock("../services", () => ({
  GetService: {
    byFields: jest.fn(),
  },
}));

const mockRole = (role: Roles | null) =>
  (GetService.byFields as jest.Mock).mockResolvedValue(role ? [{ Id: 1, AccountType: role }] : []);

const makeRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const makeReq = (userId: number | undefined, params: Record<string, string> = {}) =>
  ({ User: userId ? { Id: userId } : undefined, params, headers: {} }) as any;

describe("authorize middleware", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("requireSelf", () => {
    it("allows a user to access their own UserId", async () => {
      mockRole(Roles.user);
      const next = jest.fn(), res = makeRes();
      await requireSelf("UserId")(makeReq(5, { UserId: "5" }), res, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("blocks a user from another user's UserId", async () => {
      mockRole(Roles.user);
      const next = jest.fn(), res = makeRes();
      await requireSelf("UserId")(makeReq(5, { UserId: "6" }), res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("lets an administrator access any UserId", async () => {
      mockRole(Roles.admin);
      const next = jest.fn(), res = makeRes();
      await requireSelf("UserId")(makeReq(1, { UserId: "6" }), res, next);
      expect(next).toHaveBeenCalled();
    });

    it("blocks requests without a token user", async () => {
      const next = jest.fn(), res = makeRes();
      await requireSelf("UserId")(makeReq(undefined, { UserId: "6" }), res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("requireRoles", () => {
    it("allows a matching role", async () => {
      mockRole(Roles.encoder);
      const next = jest.fn(), res = makeRes();
      await requireRoles(Roles.admin, Roles.encoder)(makeReq(2), res, next);
      expect(next).toHaveBeenCalled();
    });

    it("blocks a normal user from admin routes", async () => {
      mockRole(Roles.user);
      const next = jest.fn(), res = makeRes();
      await requireRoles(Roles.admin)(makeReq(2), res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("blocks when the account no longer exists", async () => {
      mockRole(null);
      const next = jest.fn(), res = makeRes();
      await requireRoles(Roles.admin)(makeReq(2), res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("canAccessUser", () => {
    it("does not query the database for the owner", async () => {
      expect(await canAccessUser(makeReq(9), 9)).toBe(true);
      expect(GetService.byFields).not.toHaveBeenCalled();
    });
  });
});
