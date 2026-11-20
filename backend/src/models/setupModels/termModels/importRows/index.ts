import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../../../../config";
import { ImportLookups, ImportPlan, planImport, RowResult, SubTermRowInput, TermRowInput } from "../../../../functions";

export interface ImportRowsSummary { termsAdded: number; subTermsAdded: number; skipped: number; problems: number }
export interface ImportRowsResponse { summary: ImportRowsSummary; results: RowResult[]; saved: boolean }

const summarize = (plan: ImportPlan): ImportRowsSummary => ({
  termsAdded: plan.terms.length,
  subTermsAdded: plan.subTerms.length,
  skipped: plan.results.filter((r) => r.Status === "skip").length,
  problems: plan.results.filter((r) => r.Status === "error").length,
});

/**
 * Imports spreadsheet rows. With DryRun only the plan is returned (for the preview).
 * Otherwise the rows marked "add" are saved in one transaction: either all of them
 * are saved or, if anything fails, none are. Rows with problems are never saved.
 */
export const importRowsModel = async (
  Terms: TermRowInput[],
  SubTerms: SubTermRowInput[],
  DryRun: boolean,
  CurrentId: number,
): Promise<ImportRowsResponse> => {
  const connection = await pool.getConnection();
  try {
    if (!DryRun) await connection.beginTransaction();
    // Read inside the transaction so the plan matches what is saved
    const lock = DryRun ? "" : " FOR UPDATE";
    const read = async <T>(sql: string) => (await connection.query<RowDataPacket[]>(sql))[0] as unknown as T;
    const lookups: ImportLookups = {
      volumes: await read("SELECT Id, Title FROM chapter"),
      categories: await read("SELECT Id, Category FROM category"),
      terms: await read(`SELECT Id, ChapterId, Term FROM term${lock}`),
      subTerms: await read(`SELECT TermId, CategoryId, Term, Description FROM termline${lock}`),
      positions: await read("SELECT TermId, MAX(Position) AS Position FROM termline GROUP BY TermId"),
    };

    const plan = planImport(Terms, SubTerms, lookups);
    const summary = summarize(plan);
    if (DryRun || (!plan.terms.length && !plan.subTerms.length)) {
      if (!DryRun) await connection.rollback();
      return { summary, results: plan.results, saved: false };
    }

    const now = new Date();
    const newTermIds = new Map<string, number>();
    for (const t of plan.terms) {
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO term (ChapterId, Term, Focus, Definition, CreatedBy, DateCreated) VALUES (?, ?, ?, ?, ?, ?)",
        [t.ChapterId, t.Term, t.Focus, "", CurrentId, now],
      );
      newTermIds.set(t.Key, result.insertId);
    }
    for (const s of plan.subTerms) {
      const termId = s.TermId ?? newTermIds.get(s.TermKey ?? "");
      if (!termId) throw new Error("A sub term's term was not saved");
      await connection.execute(
        "INSERT INTO termline (TermId, CategoryId, Term, Description, Position, IsBorderLeft, CreatedBy, DateCreated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [termId, s.CategoryId, s.Term, s.Description, s.Position, 0, CurrentId, now],
      );
    }
    await connection.commit();
    return { summary, results: plan.results, saved: true };
  } catch (error: any) {
    if (!DryRun) await connection.rollback().catch(() => undefined);
    logging.log("----------------------------------------");
    logging.error("TermTable-Model [importRowsModel]:", error.message);
    logging.log("----------------------------------------");
    throw error;
  } finally {
    connection.release();
  }
};
