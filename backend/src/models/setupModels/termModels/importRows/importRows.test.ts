import { importRowsModel } from '.';
import { pool } from '../../../../config';

jest.mock('../../../../config', () => ({ pool: { getConnection: jest.fn() } }));

const fakeConnection = (failOnSubTerm = false) => {
  const tables: Record<string, any[]> = {
    chapter: [{ Id: 1, Title: 'Skeletal System' }],
    category: [{ Id: 10, Category: 'Brief Definition' }],
    term: [{ Id: 100, ChapterId: 1, Term: 'Cranium' }],
    termline: [],
  };
  let nextId = 500;
  return {
    beginTransaction: jest.fn(), commit: jest.fn(), rollback: jest.fn().mockResolvedValue(undefined), release: jest.fn(),
    query: jest.fn(async (sql: string) => {
      if (sql.includes('MAX(Position)')) return [[{ TermId: 100, Position: 2 }]];
      const table = /FROM (\w+)/.exec(sql)![1];
      return [tables[table]];
    }),
    execute: jest.fn(async (sql: string) => {
      if (failOnSubTerm && sql.startsWith('INSERT INTO termline')) throw new Error('boom');
      return [{ insertId: nextId++, affectedRows: 1 }];
    }),
  };
};

const terms = [{ Row: 2, Volume: 'Skeletal System', Term: 'Mandible' }, { Row: 3, Volume: 'Skeletal System', Term: 'Cranium' }];
const subTerms = [
  { Row: 2, Volume: 'Skeletal System', Term: 'Mandible', Category: 'Brief Definition', Description: 'Lower jaw.' },
  { Row: 3, Volume: 'Skeletal System', Term: 'Cranium', Category: 'Brief Definition', Description: 'Skull.' },
];

beforeAll(() => { (global as any).logging = { log: jest.fn(), error: jest.fn() }; });
afterEach(() => jest.clearAllMocks());

describe('importRowsModel', () => {
  it('only previews on a dry run: no transaction, no inserts', async () => {
    const connection = fakeConnection();
    (pool.getConnection as jest.Mock).mockResolvedValue(connection);
    const result = await importRowsModel(terms, subTerms, true, 16);
    expect(result).toMatchObject({ saved: false, summary: { termsAdded: 1, subTermsAdded: 2, skipped: 1, problems: 0 } });
    expect(connection.beginTransaction).not.toHaveBeenCalled();
    expect(connection.execute).not.toHaveBeenCalled();
    expect(connection.release).toHaveBeenCalled();
  });

  it('saves new terms first, then sub terms pointing at them, in one transaction', async () => {
    const connection = fakeConnection();
    (pool.getConnection as jest.Mock).mockResolvedValue(connection);
    const result = await importRowsModel(terms, subTerms, false, 16);
    expect(result.saved).toBe(true);
    const calls = connection.execute.mock.calls.map(([sql, values]: any) => [sql.split(' (')[0], values]);
    expect(calls[0]).toEqual(['INSERT INTO term', [1, 'Mandible', null, '', 16, expect.any(Date)]]);
    // New term's id (500) with position 1; existing term 100 continues after position 2
    expect(calls[1]).toEqual(['INSERT INTO termline', [500, 10, '', '<p>Lower jaw.</p>', 1, 0, 16, expect.any(Date)]]);
    expect(calls[2]).toEqual(['INSERT INTO termline', [100, 10, '', '<p>Skull.</p>', 3, 0, 16, expect.any(Date)]]);
    expect(connection.commit).toHaveBeenCalled();
    expect(connection.rollback).not.toHaveBeenCalled();
  });

  it('undoes everything if any insert fails', async () => {
    const connection = fakeConnection(true);
    (pool.getConnection as jest.Mock).mockResolvedValue(connection);
    await expect(importRowsModel(terms, subTerms, false, 16)).rejects.toThrow('boom');
    expect(connection.commit).not.toHaveBeenCalled();
    expect(connection.rollback).toHaveBeenCalled();
    expect(connection.release).toHaveBeenCalled();
  });
});
