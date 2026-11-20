import { readFileSync } from 'fs';
import { join } from 'path';
import { checkImportScript } from '.';

const rejected = (sql: string) => {
  const result = checkImportScript(sql);
  expect(result.ok).toBe(false);
  return 'reason' in result ? result.reason : '';
};

describe('checkImportScript', () => {
  describe('accepts real imports', () => {
    it('accepts the INSERT from the October 2024 term dump', () => {
      const dump = readFileSync(join(__dirname, '../../../../DATABASE/Dump20241016/rtmdb_term.sql'), 'utf8');
      const insert = dump.split('\n').find((line) => line.startsWith('INSERT INTO'))!;
      const result = checkImportScript(insert);
      expect(result).toEqual({ ok: true, table: 'term', rows: 3 }); // that dump holds 3 terms
    });

    it('accepts a column list, NOW(), NULL, negative numbers and comments', () => {
      expect(checkImportScript(`
        -- new terms for the joint volume
        INSERT INTO \`rtmdb\`.\`termline\` (TermId, CategoryId, Term, Description, Position, IsBorderLeft, CreatedBy, DateCreated)
        VALUES (12, 13, '', '<p>Small joint</p>', -1, 0, 16, NOW()),
               (12, 8, 'artic-', "joint; DROP TABLE user", 2, 1, 16, CURRENT_TIMESTAMP); /* end */
      `)).toEqual({ ok: true, table: 'termline', rows: 2 });
    });

    it('treats escaped and doubled quotes as text', () => {
      expect(checkImportScript(`INSERT INTO term VALUES (1, 1, 'It''s a \\'test\\'', NULL, NULL, NULL, NULL, 16, NOW(), NULL, NULL)`).ok).toBe(true);
    });
  });

  describe('refuses anything else', () => {
    it.each([
      ['DROP TABLE term'],
      ['UPDATE user SET AccountType = "administrator"'],
      ['DELETE FROM term'],
      ['TRUNCATE term'],
      ['INSERT INTO user VALUES (1, "administrator")'],
      ['INSERT INTO term SELECT * FROM user'],
      ['INSERT INTO term (Term) VALUES ((SELECT Password FROM user LIMIT 1))'],
      ['INSERT INTO term (Term) VALUES (SLEEP(10))'],
      ['INSERT INTO term (Term) VALUES (\'a\'); DROP TABLE term'],
      ['INSERT INTO term (Term) VALUES (\'a\') -- \n; DROP TABLE term'],
      ['/*!50000 DROP TABLE term */ INSERT INTO term (Term) VALUES (\'a\')'],
      ['INSERT INTO term (Password) VALUES (\'a\')'],
      ['INSERT INTO term (Term) VALUES (\'a\') ON DUPLICATE KEY UPDATE Term = \'b\''],
      ['INSERT INTO term (Term) VALUES (0x41)'],
      [''],
    ])('%s', (sql) => {
      rejected(sql);
    });

    it('explains why', () => {
      expect(rejected('INSERT INTO user VALUES (1)')).toMatch(/term and termline/);
      expect(rejected("INSERT INTO term (Term) VALUES ('a'); INSERT INTO term (Term) VALUES ('b')")).toMatch(/one INSERT/);
    });
  });
});
