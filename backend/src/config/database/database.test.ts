import { pool, testConnection } from ".";
import { createPool } from "mysql2/promise";

jest.mock("mysql2/promise", () => ({
  createPool: jest.fn().mockReturnValue({
    getConnection: jest.fn(),
    release: jest.fn(),
  }),
}));

const logging = require("../logging").logging;

describe("testConnection", () => {
  it("should successfully connect to the database", async () => {

  });
});