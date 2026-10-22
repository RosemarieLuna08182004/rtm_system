import { getModel } from '.';
import { GetService } from '../../../../services';
import { Error as err, Success } from '../../../../shared';

jest.mock('../../../../services', () => ({
  GetService: {
    byFields: jest.fn(),
  },
}));

describe('getModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if Id is not a number', async () => {
    const result = await getModel(parseInt('abc'));
    expect(result).toEqual({ data: [], message: err.m014 });
  }, 10000);

  it('should return an error if Id is undefined', async () => {
    const result = await getModel(undefined as unknown as number);
    expect(result).toEqual({ data: [], message: err.m014 });
  }, 10000);

  it('should return an error if no response is received from GetService.byFields', async () => {
    (GetService.byFields as jest.Mock).mockResolvedValue(null);

    const result = await getModel(1);
    expect(result).toEqual({ data: [], message: err.m011 });
  }, 10000);

  it('should return the data and success message if the response is valid', async () => {
    const mockResponse = [{ Id: 1, UserId: 1, Coins: 0 }];
    (GetService.byFields as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getModel(1);
    expect(result).toEqual({ data: mockResponse[0], message: Success.m001 });
  }, 10000);

  it('should handle exceptions and return the correct error message', async () => {
    (GetService.byFields as jest.Mock).mockImplementation(() => {
      throw new Error('Connection failed');
    });

    const result = await getModel(1);
    expect(result).toEqual({ data: [], message: err.m001 });
  }, 10000);
});
