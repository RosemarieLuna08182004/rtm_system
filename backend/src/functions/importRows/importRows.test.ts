import { ImportLookups, planImport, toRichText } from '.';

const lookups = (): ImportLookups => ({
  volumes: [{ Id: 1, Title: 'Skeletal System' }, { Id: 2, Title: 'Muscular System' }],
  categories: [{ Id: 10, Category: 'Brief Definition' }, { Id: 11, Category: 'Etymology' }],
  terms: [{ Id: 100, ChapterId: 1, Term: 'Cranium' }],
  subTerms: [{ TermId: 100, CategoryId: 10, Term: '', Description: '<p>The skull.</p>' }],
  positions: [{ TermId: 100, Position: 3 }],
});

describe('toRichText', () => {
  it('escapes markup and makes one paragraph per line', () => {
    expect(toRichText(' A < B & C \r\n\r\nSecond ')).toBe('<p>A &lt; B &amp; C</p><p>Second</p>');
  });
});

describe('planImport', () => {
  it('adds a new term and skips one that already exists in the volume, ignoring case and spaces', () => {
    const plan = planImport([
      { Row: 2, Volume: 'skeletal  system', Term: 'Mandible' },
      { Row: 3, Volume: 'Skeletal System', Term: '  cranium ' },
    ], [], lookups());
    expect(plan.terms).toEqual([{ Key: '1|mandible', ChapterId: 1, Term: 'Mandible', Focus: null }]);
    expect(plan.results.map(r => r.Status)).toEqual(['add', 'skip']);
  });

  it('allows the same term name in a different volume', () => {
    const plan = planImport([{ Row: 2, Volume: 'Muscular System', Term: 'Cranium' }], [], lookups());
    expect(plan.terms).toHaveLength(1);
  });

  it('skips a term repeated within the file', () => {
    const plan = planImport([
      { Row: 2, Volume: 'Skeletal System', Term: 'Femur' },
      { Row: 3, Volume: 'Skeletal System', Term: 'FEMUR' },
    ], [], lookups());
    expect(plan.terms).toHaveLength(1);
    expect(plan.results[1]).toMatchObject({ Status: 'skip', Row: 3 });
  });

  it('reports unknown volumes, empty cells and disallowed characters', () => {
    const plan = planImport([
      { Row: 2, Volume: 'Skeletel System', Term: 'Femur' },
      { Row: 3, Volume: 'Skeletal System', Term: '' },
      { Row: 4, Volume: 'Skeletal System', Term: 'Femur 2' },
    ], [], lookups());
    expect(plan.terms).toHaveLength(0);
    expect(plan.results.map(r => r.Status)).toEqual(['error', 'error', 'error']);
    expect(plan.results[0].Message).toContain('Skeletel System');
  });

  it('adds a sub term under an existing term with the next position', () => {
    const plan = planImport([], [
      { Row: 2, Volume: 'Skeletal System', Term: 'Cranium', Category: 'etymology', Title: '', Description: 'From Greek kranion.' },
    ], lookups());
    expect(plan.subTerms).toEqual([{ TermId: 100, TermKey: null, CategoryId: 11, Term: '', Description: '<p>From Greek kranion.</p>', Position: 4 }]);
  });

  it('adds a sub term under a term added by the same file', () => {
    const plan = planImport(
      [{ Row: 2, Volume: 'Skeletal System', Term: 'Mandible' }],
      [
        { Row: 2, Volume: 'Skeletal System', Term: 'Mandible', Category: 'Brief Definition', Description: 'The lower jaw.' },
        { Row: 3, Volume: 'Skeletal System', Term: 'Mandible', Category: 'Etymology', Description: 'From Latin.' },
      ],
      lookups(),
    );
    expect(plan.subTerms.map(s => [s.TermId, s.TermKey, s.Position])).toEqual([[null, '1|mandible', 1], [null, '1|mandible', 2]]);
  });

  it('skips a sub term that already exists and reports one whose term is missing', () => {
    const plan = planImport([], [
      { Row: 2, Volume: 'Skeletal System', Term: 'Cranium', Category: 'Brief Definition', Title: '', Description: 'The   skull.' },
      { Row: 3, Volume: 'Skeletal System', Term: 'Tibia', Category: 'Brief Definition', Description: 'Shin bone.' },
      { Row: 4, Volume: 'Skeletal System', Term: 'Cranium', Category: 'Nope', Description: 'x' },
    ], lookups());
    expect(plan.subTerms).toHaveLength(0);
    expect(plan.results.map(r => r.Status)).toEqual(['skip', 'error', 'error']);
    expect(plan.results[1].Message).toContain('Add it on the Terms sheet');
  });

  it('points to the Terms sheet when the sub term\'s term row has a problem', () => {
    const plan = planImport(
      [{ Row: 2, Volume: 'Skeletal System', Term: 'Ulna', Focus: 'x'.repeat(300) }],
      [{ Row: 2, Volume: 'Skeletal System', Term: 'Ulna', Category: 'Etymology', Description: 'Elbow.' }],
      lookups(),
    );
    expect(plan.results.map(r => r.Status)).toEqual(['error', 'error']);
    expect(plan.results[1].Message).toContain('fix that first');
  });
});
