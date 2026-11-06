import { getIllustrationsModel } from "./index";
import { GetService } from "../../../../services";
import { Error as err } from "../../../../shared";

jest.mock("../../../../services", () => ({
  GetService: { byFields: jest.fn() },
}));

// First call: the caller's chapter statuses (q016). Second call: illustrated terms in the day's order (q028).
const chapters = [
  { ChapterId: 1, Title: "Heart ", Status: "Unlock" },
  { ChapterId: 2, Title: "Bones", Status: "Lock" },
];

describe("getIllustrationsModel", () => {
  beforeEach(() => jest.clearAllMocks());

  it("keeps only unlocked chapters, in the query's order, up to the limit", async () => {
    (GetService.byFields as jest.Mock)
      .mockResolvedValueOnce(chapters)
      .mockResolvedValueOnce([
        { TermId: 5, Term: " Aorta ", ChapterId: 1, Illustration: "https://x/aorta.jpg" },
        { TermId: 6, Term: "Femur", ChapterId: 2, Illustration: "https://x/femur.jpg" },
        { TermId: 7, Term: "Atrium", ChapterId: 1, Illustration: "https://x/atrium.jpg" },
        { TermId: 8, Term: "Valve", ChapterId: 1, Illustration: "https://x/valve.jpg" },
      ]);
    const result = await getIllustrationsModel(7, 2, "2026-11-06");
    expect((GetService.byFields as jest.Mock).mock.calls[1][3]).toEqual(["2026-11-06"]);
    expect(result.data).toEqual([
      { TermId: 5, Term: "Aorta", ChapterId: 1, ChapterTitle: "Heart", Illustration: "https://x/aorta.jpg" },
      { TermId: 7, Term: "Atrium", ChapterId: 1, ChapterTitle: "Heart", Illustration: "https://x/atrium.jpg" },
    ]);
  });

  it("returns an empty list when nothing is unlocked", async () => {
    (GetService.byFields as jest.Mock)
      .mockResolvedValueOnce([{ ChapterId: 2, Title: "Bones", Status: "Lock" }])
      .mockResolvedValueOnce([{ TermId: 6, Term: "Femur", ChapterId: 2, Illustration: "https://x/femur.jpg" }]);
    expect((await getIllustrationsModel(7, 8, "2026-11-06")).data).toEqual([]);
  });

  it("returns an error result when the query fails", async () => {
    (GetService.byFields as jest.Mock).mockRejectedValue(new Error("db down"));
    expect(await getIllustrationsModel(7, 8, "2026-11-06")).toEqual({ data: [], message: err.m001 });
  });
});
