export enum TermQuery {
  q001 = `SELECT * FROM term ORDER BY term.Term ASC`,
  q002 = `SELECT * FROM term WHERE Id = ?`,
  q003 = "SELECT `Id` FROM `term` WHERE `Term` = ? AND `ChapterId` = ?",
  q004 = `SELECT * FROM term WHERE CreatedBy = ? ORDER BY term.Term ASC`,
  q005 = `SELECT * FROM term WHERE UpdatedBy = ? ORDER BY term.Term ASC`,
  q006 = `SELECT Id FROM term WHERE Id = ?`,
  q007 = `SELECT Id FROM term WHERE Id = ? AND (EXISTS (SELECT 1 FROM termline WHERE TermId = term.Id) OR EXISTS (SELECT 1 FROM userterms WHERE TermId = term.Id))`,
  q008 = `SELECT Id FROM termline WHERE TermId = ?`,
  q009 = `DELETE FROM term`,
  q0010 = `DELETE FROM term WHERE Id = ?`,
  q0011 = `SELECT term.Id, term.ChapterId, chapter.Title AS ChapterTitle, term.Term, term.Focus, term.Definition, term.VoiceOver, term.Illustration, created.Name AS CreatedBy, term.DateCreated, updated.Name AS UpdatedBy, term.DateUpdated FROM term LEFT JOIN chapter ON chapter.Id = term.ChapterId LEFT JOIN user AS created ON created.Id = term.CreatedBy LEFT JOIN user AS updated ON updated.Id = term.UpdatedBy WHERE term.Id = ?`,
  q0012 = `SELECT term.Id, term.ChapterId, chapter.Title AS ChapterTitle, term.Term, term.Focus, term.Definition, term.VoiceOver, created.Name AS CreatedBy, term.DateCreated, updated.Name AS UpdatedBy, term.DateUpdated FROM term LEFT JOIN chapter ON chapter.Id = term.ChapterId LEFT JOIN user AS created ON created.Id = term.CreatedBy LEFT JOIN user AS updated ON updated.Id = term.UpdatedBy ORDER BY term.Term ASC`,
  q0013 = `SELECT term.Id, term.ChapterId, chapter.Title AS ChapterTitle, term.Term, term.Focus, term.Definition, term.VoiceOver, created.Name AS CreatedBy, term.DateCreated, updated.Name AS UpdatedBy, term.DateUpdated FROM term INNER JOIN chapter ON chapter.Id = term.ChapterId LEFT JOIN user AS created ON created.Id = term.CreatedBy  LEFT JOIN user AS updated ON updated.Id = term.UpdatedBy WHERE term.ChapterId = ? ORDER BY term.Term ASC`,
  q0014 = `
    SELECT 
    term.Id, 
    term.ChapterId, 
    chapter.Title AS ChapterTitle,
    term.Term, 
    term.Focus, 
    term.Definition, 
    term.VoiceOver, 
    created.Name AS CreatedBy, 
    term.DateCreated, 
    updated.Name AS UpdatedBy, 
    term.DateUpdated, 
    CASE
        WHEN bookmark.ChapterId IS NOT NULL AND bookmark.Status IS NOT NULL
        THEN bookmark.Status
        ELSE 
            CASE 
                WHEN bookmark.ChapterId IS NOT NULL
                THEN 2
                ELSE 1
            END
    END AS Status
FROM term 
INNER JOIN chapter ON chapter.Id = term.ChapterId 
LEFT JOIN userterms ON userterms.ChapterId = chapter.Id AND userterms.UserId = ?
LEFT JOIN user AS created ON created.Id = term.CreatedBy 
LEFT JOIN user AS updated ON updated.Id = term.UpdatedBy
LEFT JOIN userterms AS bookmark ON bookmark.TermId = term.Id AND bookmark.UserId = userterms.UserId
WHERE term.ChapterId = ?
`,
}
