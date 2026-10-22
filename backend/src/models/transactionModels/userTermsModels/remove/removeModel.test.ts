import { removeModel } from '.';
import { isDefault, isFound } from '../../../../functions';
import { RemoveService } from '../../../../services';
import { DBTable, Error as err, Success, UserTermsQuery } from '../../../../shared';

jest.mock('../../../../functions', () => ({
  isDefault: jest.fn(),
  isFound: jest.fn(),
}));

jest.mock('../../../../services', () => ({
  RemoveService: {
    byId: jest.fn(),
  },
}));

describe('removeModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if Id is not provided or is not a number', async () => {
    const response = await removeModel(undefined as unknown as number);
    expect(response).toEqual({ data: false, message: err.m014 });
    
    const invalidResponse = await removeModel('invalid' as unknown as number);
    expect(invalidResponse).toEqual({ data: false, message: err.m014 });

    expect(isDefault).not.toHaveBeenCalled();
    expect(isFound).not.toHaveBeenCalled();
    expect(RemoveService.byId).not.toHaveBeenCalled();
  });

  it('should return an error if the record is a default entry', async () => {
    (isDefault as jest.Mock).mockResolvedValue({ data: true });

    const response = await removeModel(1);
    expect(response).toEqual({ data: false, message: err.m017 });

    expect(isDefault).toHaveBeenCalledWith(1, DBTable.t009);
    expect(isFound).not.toHaveBeenCalled();
    expect(RemoveService.byId).not.toHaveBeenCalled();
  });

  it('should return an error if the record is found in UserTermsQuery', async () => {
    (isDefault as jest.Mock).mockResolvedValue({ data: false });
    (isFound as jest.Mock).mockResolvedValue({ data: true });

    const response = await removeModel(2);
    expect(response).toEqual({ data: false, message: err.m017 });

    expect(isDefault).toHaveBeenCalledWith(2, DBTable.t009);
    expect(isFound).toHaveBeenCalledWith(UserTermsQuery.q013, ['Id'], [Number], [2]);
    expect(RemoveService.byId).not.toHaveBeenCalled();
  });

  it('should return an error if the record could not be removed', async () => {
    (isDefault as jest.Mock).mockResolvedValue({ data: false });
    (isFound as jest.Mock).mockResolvedValue({ data: false });
    (RemoveService.byId as jest.Mock).mockResolvedValue(false);

    const response = await removeModel(3);
    expect(response).toEqual({ data: false, message: err.m014 });

    expect(isDefault).toHaveBeenCalledWith(3, DBTable.t009);
    expect(isFound).toHaveBeenCalledWith(UserTermsQuery.q013, ['Id'], [Number], [3]);
    expect(RemoveService.byId).toHaveBeenCalledWith(3, DBTable.t009);
  });

  it('should return success when the record is successfully removed', async () => {
    (isDefault as jest.Mock).mockResolvedValue({ data: false });
    (isFound as jest.Mock).mockResolvedValue({ data: false });
    (RemoveService.byId as jest.Mock).mockResolvedValue(true);

    const response = await removeModel(4);
    expect(response).toEqual({ data: true, message: Success.m003 });

    expect(isDefault).toHaveBeenCalledWith(4, DBTable.t009);
    expect(isFound).toHaveBeenCalledWith(UserTermsQuery.q013, ['Id'], [Number], [4]);
    expect(RemoveService.byId).toHaveBeenCalledWith(4, DBTable.t009);
  });

});
