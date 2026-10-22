import { getByEmail } from "./";
import { GetService } from "../../../services";
import { Error as err, FnQuery } from "../../../shared";

jest.mock("../../../services", () => ({
  GetService: {
    byFields: jest.fn(),
  },
}));

describe("getByEmail function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error when email is not provided", async () => {
    const result = await getByEmail();
    expect(result).toEqual({ data: {}, message: err.m014 });
  });

  it("should return an error when email is not a string", async () => {
    const result = await getByEmail(123 as any);
    expect(result).toEqual({ data: {}, message: err.m014 });
  });

  it("should return an error when email is an empty string", async () => {
    const result = await getByEmail(" ");
    expect(result).toEqual({ data: {}, message: err.m014 });
  });

  it("should return a user when a valid email is provided and found in the database", async () => {
    const mockUser = [{ id: 1, Email: "test@example.com" }];
    (GetService.byFields as jest.Mock).mockResolvedValue(mockUser);

    const result = await getByEmail("test@example.com");

    expect(GetService.byFields).toHaveBeenCalledWith(FnQuery.q001, ["Email"], [String], ["test@example.com"]);
    expect(result).toEqual({ data: mockUser[0], message: err.m011 });
  });

  it("should return an error when user is not found", async () => {
    (GetService.byFields as jest.Mock).mockResolvedValue(null);

    const result = await getByEmail("test@example.com");

    expect(GetService.byFields).toHaveBeenCalledWith(FnQuery.q001, ["Email"], [String], ["test@example.com"]);
    expect(result).toEqual({ data: {}, message: err.m011 });
  });

  it("should return an error when there is an exception during the query", async () => {
    (GetService.byFields as jest.Mock).mockRejectedValue(new Error("Database error"));

    const result = await getByEmail("test@example.com");

    expect(GetService.byFields).toHaveBeenCalledWith(FnQuery.q001, ["Email"], [String], ["test@example.com"]);
    expect(result).toEqual({ data: {}, message: err.m001 });
  });
});
