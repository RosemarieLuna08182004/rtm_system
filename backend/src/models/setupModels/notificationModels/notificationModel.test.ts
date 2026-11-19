import NotificationModel, { NotificationStatus } from '.';
import { AddService, GetService, RemoveService, UpdateService } from '../../../services';
import { DBTable, Error as err, Success } from '../../../shared';

jest.mock('../../../services', () => ({
  AddService: { record: jest.fn() },
  GetService: { byFields: jest.fn(), byQuery: jest.fn() },
  UpdateService: { record: jest.fn(), condition: jest.fn() },
  RemoveService: { byId: jest.fn() },
}));

describe('NotificationModel', () => {
  afterEach(() => jest.clearAllMocks());

  describe('add', () => {
    it('stores an unread notification, trimmed to the column sizes', async () => {
      (AddService.record as jest.Mock).mockResolvedValue(true);
      const result = await NotificationModel.add('x'.repeat(300), '/a/sales', 43);
      expect(result).toEqual({ data: true, message: Success.m002 });
      const [table, fields, , values] = (AddService.record as jest.Mock).mock.calls[0];
      expect(table).toBe(DBTable.t010);
      expect(fields).toEqual(['UserId', 'Description', 'LinkedComponent', 'Status', 'DateCreated']);
      expect(values[0]).toBe(43);
      expect(values[1]).toHaveLength(255);
      expect(values[2]).toBe('/a/sales');
      expect(values[3]).toBe(NotificationStatus.unread);
    });

    it('never throws when the insert fails', async () => {
      (AddService.record as jest.Mock).mockRejectedValue(new Error('db down'));
      await expect(NotificationModel.add('Something happened')).resolves.toEqual({ data: false, message: err.m001 });
    });
  });

  describe('addNewUser', () => {
    it('links to the new user found by email', async () => {
      (GetService.byFields as jest.Mock).mockResolvedValue([{ Id: 99 }]);
      (AddService.record as jest.Mock).mockResolvedValue(true);
      await NotificationModel.addNewUser('ann@example.com', 'Ann', 'Google');
      const values = (AddService.record as jest.Mock).mock.calls[0][3];
      expect(values[0]).toBe(99);
      expect(values[1]).toBe('New user signed up with Google: Ann (ann@example.com)');
      expect(values[2]).toBe('/a/user/d/99');
    });

    it('never throws when the lookup fails', async () => {
      (GetService.byFields as jest.Mock).mockRejectedValue(new Error('db down'));
      await expect(NotificationModel.addNewUser('ann@example.com', 'Ann')).resolves.toEqual({ data: false, message: err.m001 });
      expect(AddService.record).not.toHaveBeenCalled();
    });
  });

  describe('markRead', () => {
    it('marks an existing notification read', async () => {
      (GetService.byFields as jest.Mock).mockResolvedValue([{ Id: 5 }]);
      (UpdateService.record as jest.Mock).mockResolvedValue(true);
      expect(await NotificationModel.markRead(5)).toEqual({ data: true, message: Success.m004 });
      expect((UpdateService.record as jest.Mock).mock.calls[0][4][0]).toBe(NotificationStatus.read);
    });

    it('reports a missing notification', async () => {
      (GetService.byFields as jest.Mock).mockResolvedValue([]);
      expect(await NotificationModel.markRead(5)).toEqual({ data: false, message: err.m011 });
      expect(UpdateService.record).not.toHaveBeenCalled();
    });

    it('rejects an invalid id', async () => {
      expect(await NotificationModel.markRead(NaN)).toEqual({ data: false, message: err.m005 });
    });
  });

  describe('markAllRead', () => {
    it('succeeds without updating when nothing is unread', async () => {
      (GetService.byFields as jest.Mock).mockResolvedValue([]);
      expect(await NotificationModel.markAllRead()).toEqual({ data: true, message: Success.m004 });
      expect(UpdateService.condition).not.toHaveBeenCalled();
    });

    it('marks every unread notification read', async () => {
      (GetService.byFields as jest.Mock).mockResolvedValue([{ Id: 1 }, { Id: 2 }]);
      (UpdateService.condition as jest.Mock).mockResolvedValue(true);
      expect(await NotificationModel.markAllRead()).toEqual({ data: true, message: Success.m004 });
      const [, , , values, , conditionValues] = (UpdateService.condition as jest.Mock).mock.calls[0];
      expect(values[0]).toBe(NotificationStatus.read);
      expect(conditionValues).toEqual([NotificationStatus.unread]);
    });
  });

  describe('remove', () => {
    it('deletes an existing notification', async () => {
      (GetService.byFields as jest.Mock).mockResolvedValue([{ Id: 5 }]);
      (RemoveService.byId as jest.Mock).mockResolvedValue(true);
      expect(await NotificationModel.remove(5)).toEqual({ data: true, message: Success.m003 });
    });

    it('reports a missing notification', async () => {
      (GetService.byFields as jest.Mock).mockResolvedValue([]);
      expect(await NotificationModel.remove(5)).toEqual({ data: false, message: err.m011 });
      expect(RemoveService.byId).not.toHaveBeenCalled();
    });
  });
});
