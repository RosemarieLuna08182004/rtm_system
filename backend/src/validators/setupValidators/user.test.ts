import { userValidatorOnCreate } from "./user";

const base = { Email: "juan@example.com", Password: "password123" };
const nameOk = (Name: string) => !userValidatorOnCreate.validate({ ...base, Name }).error;

describe("user name rule", () => {
  it.each(["Juan dela Cruz", "Peña", "Ma. Clara O'Neil-Santos Jr.", "José Ünal"])("accepts %s", (name) => {
    expect(nameOk(name)).toBe(true);
  });

  it.each(["R2D2", "<script>", "Juan_Cruz", ""])("rejects %s", (name) => {
    expect(nameOk(name)).toBe(false);
  });

  it("does not require AccountType from public registration", () => {
    expect(userValidatorOnCreate.validate({ ...base, Name: "Juan" }).error).toBeUndefined();
  });

  it("rejects provider tokens other than null", () => {
    expect(userValidatorOnCreate.validate({ ...base, Name: "Juan", AccessToken: "ya29.x" }).error).toBeDefined();
  });
});
