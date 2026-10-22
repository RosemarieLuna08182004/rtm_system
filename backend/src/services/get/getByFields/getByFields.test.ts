import { getByFields } from ".";
import { pool } from "../../../config";

jest.mock("../../../config", () => ({
  pool: {
    execute: jest.fn(),
  },
  closePool: {
    execute: jest.fn(),
  },
}));

describe("getByFields", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if Query is missing or not provided", async () => {
    await expect(getByFields("", [""], [String], ["test"])).rejects.toThrow(
      "Query must be a non-empty string",
    );
  }, 10000);

  it("should throw an error if Fields is not a non-empty array of strings", async () => {
    await expect(
      getByFields("SELECT * FROM TestTable", [], [String], ["string"]),
    ).rejects.toThrow("Fields must be a non-empty array of strings");
  }, 10000);

  /*it("should throw an error if Types array contains undefined values", async () => {
    await expect(
      getByFields(
        "SELECT * FROM TestTable",
        ["field1", "field2"],
        [String, undefined],
        ["data1", "data2"],
      ),
    ).rejects.toThrow("Type for field'2' is undefined");
  }, 10000);*/

  /*it("should throw an error if Datas array contains undefined values", async () => {
    await expect(
      getByFields(
        "SELECT * FROM TestTable",
        ["field1", "field2"],
        [String, String],
        ["data1", undefined],
      ),
    ).rejects.toThrow("Data for field'2' is undefined");
  }, 10000);*/

  it("should fail if parameter lengths do not match", async () => {
    await expect(
      getByFields(
        "SELECT * FROM TestTable",
        ["field1"],
        [String],
        ["data1", 123],
      ),
    ).rejects.toThrow("Parameter is empty, or their lengths do not match");
  }, 10000);

  it("should return rows if query and inputs are valid", async () => {
    const fakeResult = [{ Id: 1, Name: "Test Record" }];
    (pool.execute as jest.Mock).mockResolvedValueOnce([fakeResult]);

    const result = await getByFields(
      "SELECT * FROM TestTable WHERE Id = ?",
      ["Id"],
      [Number],
      [1],
    );
    expect(result).toEqual(fakeResult);
  }, 10000);

  it("should throw an error if pool connection fails", async () => {
    (pool.execute as jest.Mock).mockRejectedValueOnce(
      new Error("Connection failed"),
    );

    await expect(
      getByFields("SELECT * FROM TestTable", ["field1"], [String], ["data1"]),
    ).rejects.toThrow("Connection failed");
  }, 10000);
});
