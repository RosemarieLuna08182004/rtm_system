import { addModel } from "./";
import { Success, Error } from "../../../../shared";
import { isFound } from "../../../../functions";
import { AddService } from "../../../../services";
import { Status } from "../../../../types";

jest.mock("../../../../functions", () => ({
  isFound: jest.fn(),
}));

jest.mock("../../../../services", () => ({
  AddService: {
    record: jest.fn(),
  },
}));

describe("addModel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if record is a duplicate", async () => {
    (isFound as jest.Mock).mockResolvedValue({
      data: true,
      message: Error.m016,
    });

    const result = await addModel({
      UserId: 1,
      ChapterId: 1,
      TermId: 1,
      Status: 0,
    });
    expect(result).toEqual({ data: false, message: Error.m016 });
  }, 10000);

  it("should return an error if AddService fails", async () => {
    (isFound as jest.Mock).mockResolvedValue({ data: false, message: "" });
    (AddService.record as jest.Mock).mockResolvedValue(null);

    const result = await addModel({
      UserId: 1,
      ChapterId: 1,
      TermId: 1,
      Status: 0,
    });
    expect(result).toEqual({ data: false, message: Error.m003 });
  }, 10000);

  it("should return success if category is added successfully", async () => {
    (isFound as jest.Mock).mockResolvedValue({ data: false, message: "" });
    (AddService.record as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await addModel({
      UserId: 1,
      ChapterId: 1,
      TermId: 1,
      Status: 0,
    });
    expect(result).toEqual({ data: true, message: Success.m002 });
  }, 10000);
});
