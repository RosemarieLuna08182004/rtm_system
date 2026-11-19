import TokenHandler from "./tokenHandler";
import { GetService } from "../services";
import { Error } from "../shared/messages";

jest.mock("../services", () => ({
  GetService: { byFields: jest.fn() },
}));

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const admin = { Id: 16, AccountType: "administrator", Email: "admin@example.com" };
const user = { Id: 43, AccountType: "user", Email: "user@example.com" };

describe("TokenHandler.verifyAdmin", () => {
  afterEach(() => jest.clearAllMocks());

  it("lets an administrator through and records the caller", async () => {
    (GetService.byFields as jest.Mock).mockResolvedValue([admin]);
    const req: any = { User: { Id: 16 } }, res = mockRes(), next = jest.fn();
    await TokenHandler.verifyAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.CurrentUser).toEqual(admin);
  });

  it("rejects a normal user with 403", async () => {
    (GetService.byFields as jest.Mock).mockResolvedValue([user]);
    const res = mockRes(), next = jest.fn();
    await TokenHandler.verifyAdmin({ User: { Id: 43 } } as any, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: Error.m034 });
  });

  it("rejects a token whose account no longer exists with 401", async () => {
    (GetService.byFields as jest.Mock).mockResolvedValue([]);
    const res = mockRes(), next = jest.fn();
    await TokenHandler.verifyAdmin({ User: { Id: 999 } } as any, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("looks up Google-token callers by email", async () => {
    (GetService.byFields as jest.Mock).mockResolvedValue([user]);
    const res = mockRes(), next = jest.fn();
    await TokenHandler.verifyAdmin({ User: { email: "user@example.com" } } as any, res, next);
    expect((GetService.byFields as jest.Mock).mock.calls[0][3]).toEqual(["user@example.com"]);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("rejects a request with no identity", async () => {
    const res = mockRes(), next = jest.fn();
    await TokenHandler.verifyAdmin({} as any, res, next);
    expect(GetService.byFields).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("fails closed with 500 if the lookup errors", async () => {
    (GetService.byFields as jest.Mock).mockRejectedValue(new globalThis.Error("db down"));
    const res = mockRes(), next = jest.fn();
    await TokenHandler.verifyAdmin({ User: { Id: 16 } } as any, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("TokenHandler.verifySelfOrAdmin", () => {
  afterEach(() => jest.clearAllMocks());

  it("lets a user act on their own account", async () => {
    (GetService.byFields as jest.Mock).mockResolvedValue([user]);
    const next = jest.fn();
    await TokenHandler.verifySelfOrAdmin("Id")({ User: { Id: 43 }, params: { Id: "43" } } as any, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it("stops a user acting on someone else's account", async () => {
    (GetService.byFields as jest.Mock).mockResolvedValue([user]);
    const res = mockRes(), next = jest.fn();
    await TokenHandler.verifySelfOrAdmin("Id")({ User: { Id: 43 }, params: { Id: "16" } } as any, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: Error.m035 });
  });

  it("lets an administrator act on any account", async () => {
    (GetService.byFields as jest.Mock).mockResolvedValue([admin]);
    const next = jest.fn();
    await TokenHandler.verifySelfOrAdmin("Id")({ User: { Id: 16 }, params: { Id: "43" } } as any, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });
});

describe("TokenHandler.verifyBookmarkOwner", () => {
  afterEach(() => jest.clearAllMocks());
  // First lookup: the caller; second: the bookmark record's owner
  const setup = (caller: object, record: object | null) => {
    (GetService.byFields as jest.Mock).mockResolvedValueOnce([caller]);
    if (record) (GetService.byFields as jest.Mock).mockResolvedValueOnce([record]);
    else (GetService.byFields as jest.Mock).mockRejectedValueOnce(new globalThis.Error("No record found"));
  };

  it("lets the owner change their own bookmark", async () => {
    setup(user, { UserId: 43 });
    const next = jest.fn();
    await TokenHandler.verifyBookmarkOwner("Id")({ User: { Id: 43 }, params: { Id: "7" } } as any, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it("stops a user changing someone else's bookmark", async () => {
    setup(user, { UserId: 99 });
    const res = mockRes(), next = jest.fn();
    await TokenHandler.verifyBookmarkOwner("Id")({ User: { Id: 43 }, params: { Id: "7" } } as any, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("answers 404 for a bookmark that doesn't exist", async () => {
    setup(user, null);
    const res = mockRes(), next = jest.fn();
    await TokenHandler.verifyBookmarkOwner("Id")({ User: { Id: 43 }, params: { Id: "7" } } as any, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  it("lets an administrator act on any bookmark", async () => {
    setup(admin, { UserId: 99 });
    const next = jest.fn();
    await TokenHandler.verifyBookmarkOwner("Id")({ User: { Id: 16 }, params: { Id: "7" } } as any, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });
});
