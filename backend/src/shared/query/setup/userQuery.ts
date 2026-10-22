const checkForeignUser = (Table:string) => `EXISTS (SELECT 1 FROM ${Table} WHERE CreatedBy = user.Id) OR EXISTS (SELECT 1 FROM ${Table} WHERE UpdatedBy = user.Id)`;

export const UserQuery = {
  q001: "SELECT * FROM user WHERE `Id` <> 1",
  q002: `SELECT * FROM user WHERE Id = ?`,
  q003: `SELECT Id FROM user WHERE Email = ?`,
  q006: `SELECT Id FROM user WHERE Id = ?`,
  q007: `SELECT Id FROM userterms WHERE UserId = ?`,
  q008: `SELECT Id FROM userline WHERE UserId = ?`,
  q009: `SELECT Id FROM sales WHERE UserId = ?`,
  q0010: `DELETE FROM user`,
  q0011: `DELETE FROM user WHERE Id = ?`,
  q0012:  `
    SELECT Id FROM user 
    WHERE Id = ? 
    AND (
        EXISTS (SELECT 1 FROM userterms WHERE UserId = user.Id) 
        OR EXISTS (SELECT 1 FROM sales WHERE UserId = user.Id) 
        OR ${checkForeignUser('chapter')}
        OR ${checkForeignUser('term')}
        OR ${checkForeignUser('termline')}
        OR ${checkForeignUser('category')}
        OR ${checkForeignUser('product')}
    )
  `,
  q0013: `SELECT * FROM user WHERE Email = ?`,
};