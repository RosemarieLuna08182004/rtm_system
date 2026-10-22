import jwt from "jsonwebtoken";
import {
  createResetChallenge,
  createDecoyResetToken,
  readResetToken,
  isResetCodeValid,
} from "./passwordReset";
import { SECRET_KEY } from "../../config";

const HASH = "$2b$10$currentpasswordhash";

describe("password reset challenge", () => {
  it("accepts the emailed code with the current password", () => {
    const { code, token } = createResetChallenge(5, HASH);
    expect(code).toMatch(/^\d{6}$/);
    const challenge = readResetToken(token)!;
    expect(challenge.userId).toBe(5);
    expect(isResetCodeValid(challenge, code, HASH)).toBe(true);
  });

  it("rejects a wrong code", () => {
    const { code, token } = createResetChallenge(5, HASH);
    const wrong = code === "000000" ? "000001" : "000000";
    expect(isResetCodeValid(readResetToken(token)!, wrong, HASH)).toBe(false);
  });

  it("stops working once the password has changed (single use)", () => {
    const { code, token } = createResetChallenge(5, HASH);
    expect(isResetCodeValid(readResetToken(token)!, code, "$2b$10$newhash")).toBe(false);
  });

  it("does not hold the code in readable form", () => {
    const { code, token } = createResetChallenge(5, HASH);
    expect(JSON.stringify(jwt.decode(token))).not.toContain(code);
  });

  it("cannot be used as, or made from, an access token", () => {
    const access = jwt.sign({ UserId: 5, type: "reset", c: "x", f: "y" }, SECRET_KEY);
    expect(readResetToken(access)).toBeNull();
    const { token } = createResetChallenge(5, HASH);
    expect(() => jwt.verify(token, SECRET_KEY)).toThrow();
  });

  it("rejects decoy tokens issued for unknown emails", () => {
    expect(readResetToken(createDecoyResetToken())).toBeNull();
  });

  it("rejects garbage", () => {
    expect(readResetToken("not-a-token")).toBeNull();
  });
});
