import { getAllModel } from './';
import { GetService } from '../../../../services';
import { Error as err, Success } from '../../../../shared';

jest.mock('../../../../services', () => ({
  GetService: {
    byQuery: jest.fn(),
  },
}));

describe('getAllModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if no response is received from GetService.byQuery', async () => {
    (GetService.byQuery as jest.Mock).mockResolvedValue(null);

    const result = await getAllModel();
    expect(result).toEqual({ data: [], message: err.m011 });
  }, 10000);

  it('should return the data and success message if the response is valid', async () => {
    const mockResponse = [
      { Id: 1, Title: 'Test Category 1' },
      { Id: 2, Title: 'Test Category 2' },
    ];
    (GetService.byQuery as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getAllModel();
    expect(result).toEqual({ data: mockResponse, message: Success.m001 });
  }, 10000);

  it('should handle exceptions and return the correct error message', async () => {
    (GetService.byQuery as jest.Mock).mockImplementation(() => {
      throw new Error('Connection failed');
    });

    const result = await getAllModel();
    expect(result).toEqual({ data: [], message: err.m001 });
  }, 10000);
});
