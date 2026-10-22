import { getModel } from '.';
import { isFound } from '../../../../functions';
import { GetService } from '../../../../services';
import { DBTable, Error as err, Success, UserQuery } from '../../../../shared';

jest.mock('../../../../functions', () => ({
  isFound: jest.fn(),
}));

jest.mock('../../../../services', () => ({
  GetService: {
    byId: jest.fn(),
  },
}));

describe('getModel', () => {
  const mockId = 1;
  const mockData = [{ id: mockId, name: 'Sample' }];
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if Id is 0', async () => {
    const response = await getModel(0);

    expect(response).toEqual({ data: [], message: err.m014 });
    expect(isFound).not.toHaveBeenCalled();
  });

  it('should return an error if Id is not a number', async () => {
    const response = await getModel(NaN);

    expect(response).toEqual({ data: [], message: err.m014 });
    expect(isFound).not.toHaveBeenCalled();
  });

  it('should return an error if the record is not found', async () => {
    (isFound as jest.Mock).mockResolvedValue({ data: false, message: err.m011 });

    const response = await getModel(mockId);

    expect(isFound).toHaveBeenCalledWith(UserQuery.q006, ['Id'], [Number], [mockId]);
    expect(response).toEqual({ data: [], message: err.m011 });
  });

  it('should return a record if found', async () => {
    (isFound as jest.Mock).mockResolvedValue({ data: true });
    (GetService.byId as jest.Mock).mockResolvedValue(mockData);

    const response = await getModel(mockId);

    expect(isFound).toHaveBeenCalledWith(UserQuery.q006, ['Id'], [Number], [mockId]);
    expect(GetService.byId).toHaveBeenCalledWith(mockId, DBTable.t007);
    expect(response).toEqual({ data: mockData[0], message: Success.m001 });
  });

  it('should return an error if record is not found by Id', async () => {
    (isFound as jest.Mock).mockResolvedValue({ data: true });
    (GetService.byId as jest.Mock).mockResolvedValue(null);

    const response = await getModel(mockId);

    expect(isFound).toHaveBeenCalledWith(UserQuery.q006, ['Id'], [Number], [mockId]);
    expect(GetService.byId).toHaveBeenCalledWith(mockId, DBTable.t007);
    expect(response).toEqual({ data: [], message: err.m011 });
  });

  it('should log an error and return a general error message if an exception occurs', async () => {
    const mockError = new Error('Test error');
    (isFound as jest.Mock).mockRejectedValue(mockError);

    const response = await getModel(mockId);
    expect(response).toEqual({ data: [], message: err.m001 });
  });
});
