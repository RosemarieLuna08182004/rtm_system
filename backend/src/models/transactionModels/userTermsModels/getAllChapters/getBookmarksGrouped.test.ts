import { getBookmarksGroupedModel } from "./index";
import { GetService } from "../../../../services";
import { Error as err } from "../../../../shared";

jest.mock("../../../../services", () => ({
  GetService: { byFields: jest.fn() },
}));

describe("getBookmarksGroupedModel", () => {
  beforeEach(() => jest.clearAllMocks());

  it("groups rows by chapter, keeping the query's order", async () => {
    (GetService.byFields as jest.Mock).mockResolvedValue([
      { ChapterId: 2, ChapterTitle: "Bones", TermId: 10, Term: "Femur", UserTermsId: 100, Status: "Bookmark" },
      { ChapterId: 2, ChapterTitle: "Bones", TermId: 11, Term: "Tibia", UserTermsId: 101, Status: "Bookmark" },
      { ChapterId: 5, ChapterTitle: "Heart", TermId: 20, Term: null, UserTermsId: 102, Status: "Bookmark" },
    ]);
    const result = await getBookmarksGroupedModel(7);
    expect(GetService.byFields).toHaveBeenCalledTimes(1);
    expect(result.data).toEqual([
      {
        ChapterId: 2,
        Title: "Bones",
        terms: [
          { TermId: 10, Term: "Femur", UserTermsId: 100, ChapterId: 2, Status: "Bookmark" },
          { TermId: 11, Term: "Tibia", UserTermsId: 101, ChapterId: 2, Status: "Bookmark" },
        ],
      },
      {
        ChapterId: 5,
        Title: "Heart",
        terms: [{ TermId: 20, Term: "", UserTermsId: 102, ChapterId: 5, Status: "Bookmark" }],
      },
    ]);
  });

  it("returns an empty list when the user has no bookmarks", async () => {
    (GetService.byFields as jest.Mock).mockResolvedValue([]);
    expect((await getBookmarksGroupedModel(7)).data).toEqual([]);
  });

  it("returns an error result when the query fails", async () => {
    (GetService.byFields as jest.Mock).mockRejectedValue(new Error("db down"));
    expect(await getBookmarksGroupedModel(7)).toEqual({ data: [], message: err.m001 });
  });
});
