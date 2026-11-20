import { DuplicateAlerts, normalize } from './duplicateAlerts';
import NotificationModel from '.';
import { GetService } from '../../../services';
import { NotificationQuery } from '../../../shared';

jest.mock('../../../services', () => ({
  GetService: { byFields: jest.fn(), byQuery: jest.fn() },
  AddService: { record: jest.fn() },
  UpdateService: { record: jest.fn(), condition: jest.fn() },
  RemoveService: { byId: jest.fn() },
}));

/** Answer GetService.byFields by query */
const answer = (byQuery: Partial<Record<NotificationQuery, any[]>>) =>
  (GetService.byFields as jest.Mock).mockImplementation(async (query: NotificationQuery) => byQuery[query] ?? []);

describe('DuplicateAlerts', () => {
  let add: jest.SpyInstance;
  beforeEach(() => { add = jest.spyOn(NotificationModel, 'add').mockResolvedValue({ data: true, message: 'ok' }); });
  afterEach(() => { jest.clearAllMocks(); add.mockRestore(); });

  it('normalizes case, spacing and editor markup', () => {
    expect(normalize('  <p>Renal&nbsp;  Corpuscle</p> ')).toBe('renal corpuscle');
    expect(normalize(null)).toBe('');
  });

  describe('afterTermSaved', () => {
    it('alerts when a new term matches another in the same volume, linking the newest', async () => {
      answer({ [NotificationQuery.q005]: [{ Id: 3562, Term: 'Renal Corpuscle' }, { Id: 4171, Term: ' renal  corpuscle' }, { Id: 10, Term: 'Kidney' }],
               [NotificationQuery.q006]: [{ Title: 'Urinary System' }] });
      await DuplicateAlerts.afterTermSaved({ ChapterId: 13, Term: ' renal  corpuscle' }, null, 16);
      expect(add).toHaveBeenCalledWith('Duplicate term found: "renal  corpuscle" now appears 2 times in Urinary System.', '/a/term/d/4171', 16);
    });

    it('stays quiet when the name is unique in the volume', async () => {
      answer({ [NotificationQuery.q005]: [{ Id: 1, Term: 'Atlas' }] });
      await DuplicateAlerts.afterTermSaved({ ChapterId: 2, Term: 'Atlas' });
      expect(add).not.toHaveBeenCalled();
    });

    it('does not repeat the alert when an existing duplicate is re-saved unchanged', async () => {
      await DuplicateAlerts.afterTermSaved({ Term: 'Atlas ' }, { ChapterId: 2, Term: 'atlas' });
      expect(GetService.byFields).not.toHaveBeenCalled();
      expect(add).not.toHaveBeenCalled();
    });

    it('checks the new volume when a term is moved, keeping its old name', async () => {
      answer({ [NotificationQuery.q005]: [{ Id: 1, Term: 'Atlas' }, { Id: 2, Term: 'Atlas' }], [NotificationQuery.q006]: [{ Title: 'Joint System' }] });
      await DuplicateAlerts.afterTermSaved({ ChapterId: 5 }, { ChapterId: 4, Term: 'Atlas' });
      expect((GetService.byFields as jest.Mock).mock.calls[0][3]).toEqual([5]);
      expect(add).toHaveBeenCalledTimes(1);
    });

    it('never throws when the database fails', async () => {
      (GetService.byFields as jest.Mock).mockRejectedValue(new Error('db down'));
      await expect(DuplicateAlerts.afterTermSaved({ ChapterId: 1, Term: 'Atlas' })).resolves.toBeUndefined();
    });
  });

  describe('afterSubTermSaved', () => {
    const base = { TermId: 7, CategoryId: 13, Term: '', Description: '<p>Small joint</p>' };

    it('alerts on an identical sub term under the same term', async () => {
      answer({ [NotificationQuery.q007]: [{ Id: 50, Term: '', Description: 'Small joint' }, { Id: 51, Term: null, Description: '<p>Small  joint</p>' }],
               [NotificationQuery.q008]: [{ TermName: 'Atlas', Category: 'Brief Definition' }] });
      await DuplicateAlerts.afterSubTermSaved(base, null, 16);
      expect(add).toHaveBeenCalledWith('Duplicate sub term found: 2 identical "Brief Definition" entries under "Atlas".', '/a/termline/d/51', 16);
    });

    it('does not alert when the content differs', async () => {
      answer({ [NotificationQuery.q007]: [{ Id: 50, Term: '', Description: 'Small joint' }, { Id: 51, Term: '', Description: 'A different definition' }] });
      await DuplicateAlerts.afterSubTermSaved(base);
      expect(add).not.toHaveBeenCalled();
    });

    it('does not repeat on an unchanged re-save', async () => {
      await DuplicateAlerts.afterSubTermSaved({ Description: '<p>Small joint</p>' }, base);
      expect(GetService.byFields).not.toHaveBeenCalled();
    });
  });

  describe('afterImport', () => {
    it('summarises only duplicates that include newly imported records', async () => {
      (GetService.byQuery as jest.Mock).mockImplementation(async (query: NotificationQuery) => query === NotificationQuery.q010
        ? [{ Id: 1, ChapterId: 1, Term: 'Ion' }, { Id: 2, ChapterId: 1, Term: 'ion' },        // old duplicate: ignored
           { Id: 3, ChapterId: 2, Term: 'Atlas' }, { Id: 101, ChapterId: 2, Term: 'Atlas' }]  // new duplicate
        : [{ Id: 500, TermId: 3, CategoryId: 13, Term: '', Description: 'x' }]);
      await DuplicateAlerts.afterImport({ TermId: 100, LineId: 500 }, 16);
      expect(add).toHaveBeenCalledWith('Import created duplicates: 1 duplicate term. See Needs Attention on the Dashboard.', '/a', 16);
    });

    it('stays quiet when the import added no duplicates', async () => {
      (GetService.byQuery as jest.Mock).mockResolvedValue([{ Id: 101, ChapterId: 2, Term: 'Atlas' }]);
      await DuplicateAlerts.afterImport({ TermId: 100, LineId: 500 });
      expect(add).not.toHaveBeenCalled();
    });

    it('does nothing without a before-snapshot', async () => {
      await DuplicateAlerts.afterImport(null);
      expect(GetService.byQuery).not.toHaveBeenCalled();
    });
  });
});
