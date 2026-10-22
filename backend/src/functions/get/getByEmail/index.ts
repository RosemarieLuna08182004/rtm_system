import { GetService } from "../../../services";
import { Error, FnQuery } from "../../../shared";
import { ModelResponse } from "../../../types";

export const getByEmail = async (
  Email: string = "",
): Promise<ModelResponse> => {
  try {
    if (!Email || typeof Email !== "string" || !Email.trim())
      return { data: {}, message: Error.m014 };
    const user = await GetService.byFields(
      FnQuery.q001,
      ["Email"],
      [String],
      [Email],
    );
    if (!user) return { data: {}, message: Error.m011 };
    return { data: user[0], message: Error.m011 };
  } catch (error: any) {
    return { data: {}, message: Error.m001 };
  }
};
