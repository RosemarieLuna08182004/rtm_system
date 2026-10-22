export enum TermLineQuery {
    q001 = `SELECT * FROM termline`,
    q002 = `SELECT * FROM termline WHERE Id = ?`,
    q004 = `SELECT * FROM termline WHERE CreatedBy = ?`,
    q005 = `SELECT * FROM termline WHERE UpdatedBy = ?`,
    q006 = `SELECT Id FROM termline WHERE Id = ?`,
    q007 = `DELETE FROM termline`,
    q008 = `DELETE FROM termline WHERE Id = ?`,
    q009 = `SELECT termline.Id, termline.TermId, term.Term AS TermName, term.Definition AS TermDefinition, termline.Illustration, termline.CategoryId, category.Category, termline.Term, termline.Position, termline.IsBorderLeft,  termline.Description, created.Name AS CreatedBy, termline.DateCreated, updated.Name AS UpdatedBy, termline.DateUpdated FROM termline LEFT JOIN term ON term.Id = termline.TermId LEFT JOIN category ON category.Id = termline.CategoryId LEFT JOIN user AS created ON created.Id = termline.CreatedBy LEFT JOIN user AS updated ON updated.Id = termline.UpdatedBy WHERE termline.Id = ?`,
    q0010 = `SELECT termline.Id, termline.TermId, term.Term AS TermName, term.Definition AS TermDefinition, termline.Illustration, category.Category, termline.Term, termline.Description, created.Name AS CreatedBy, termline.DateCreated, updated.Name AS UpdatedBy, termline.DateUpdated FROM termline LEFT JOIN term ON term.Id = termline.TermId LEFT JOIN category ON category.Id = termline.CategoryId LEFT JOIN user AS created ON created.Id = termline.CreatedBy LEFT JOIN user AS updated ON updated.Id = termline.UpdatedBy`,
    q0011 = "SELECT `termline`.`TermId` FROM `termline` LEFT JOIN `userterms` ON `userterms`.`TermId` = `termline`.`TermId` WHERE `termline`.`Id` = ?",
    q0012 = `SELECT TermId FROM termline WHERE TermId = ? AND (EXISTS (SELECT 1 FROM userterms WHERE TermId = termline.TermId))`,
    q0013 = "SELECT termline.Id, termline.TermId, term.Term AS TermName, term.Definition AS TermDefinition, termline.Illustration, category.Category, termline.Term, termline.Description, termline.Position, termline.IsBorderLeft, created.Name AS CreatedBy, termline.DateCreated, updated.Name AS UpdatedBy, termline.DateUpdated FROM termline LEFT JOIN term ON term.Id = termline.TermId LEFT JOIN category ON category.Id = termline.CategoryId LEFT JOIN user AS created ON created.Id = termline.CreatedBy LEFT JOIN user AS updated ON updated.Id = termline.UpdatedBy WHERE `termline`.`TermId` = ? ORDER BY `termline`.`Position` ASC",
    q0014 = "SELECT `Id` FROM `termline` WHERE `TermId` = ? AND `Position`= ?"
};