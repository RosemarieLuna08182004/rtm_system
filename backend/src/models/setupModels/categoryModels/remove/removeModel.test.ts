import { removeModel } from '.';
import { Error as err, Success } from '../../../../shared';
import { RemoveService } from '../../../../services'; 
import { isDefault, isFound } from '../../../../functions';

jest.mock('../../../../services', () => ({
  RemoveService: {
    byId: jest.fn(),
  },
}));

jest.mock('../../../../functions', () => ({
  isDefault: jest.fn(),
  isFound: jest.fn(),
}));

describe('removeModel', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should return an error if Id is not provided or is not a number', async () => {
    const result = await removeModel(undefined);
    expect(result).toEqual({ data: false, message: err.m014 });
  }, 10000);

  it('should return an error if Id is a default record', async () => {
    (isDefault as jest.Mock).mockResolvedValue({ data: true });

    const result = await removeModel(1);
    expect(result).toEqual({ data: false, message: err.m017 });
  }, 10000);

  it('should return an error if the record has associated transactions', async () => {
    (isDefault as jest.Mock).mockResolvedValue({ data: false });
    (isFound as jest.Mock).mockResolvedValue({ data: true });

    const result = await removeModel(1);
    expect(result).toEqual({ data: false, message: err.m017 });
  }, 10000);

  it('should return an error if RemoveService.byId fails to delete the record', async () => {
    (isDefault as jest.Mock).mockResolvedValue({ data: false });
    (isFound as jest.Mock).mockResolvedValue({ data: false });
    (RemoveService.byId as jest.Mock).mockResolvedValue(false);

    const result = await removeModel(1);
    expect(result).toEqual({ data: false, message: err.m014 });
  }, 10000);

  it('should return success if record is valid and deleted successfully', async () => {
    (isDefault as jest.Mock).mockResolvedValue({ data: false });
    (isFound as jest.Mock).mockResolvedValue({ data: false });
    (RemoveService.byId as jest.Mock).mockResolvedValue(true);

    const result = await removeModel(1);
    expect(result).toEqual({ data: true, message: Success.m003 });
  }, 10000);

  it('should handle exceptions and return the correct error message', async () => {
    (isDefault as jest.Mock).mockImplementation(() => {
      throw new Error('Connection failed');
    });

    const result = await removeModel(1);
    expect(result).toEqual({ data: false, message: err.m001 });
  }, 10000);
});
