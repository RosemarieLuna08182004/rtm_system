import { updateModel } from '.';
import { TermLineInitial } from '../../../../types';
import { Error as err, Success } from '../../../../shared';
import { UpdateService } from '../../../../services';
import { isFound } from '../../../../functions';

jest.mock('../../../../services', () => ({
  UpdateService: {
    record: jest.fn(),
  },
}));

jest.mock('../../../../functions', () => ({
  isFound: jest.fn(),
}));

describe('updateModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if Id is not provided or is not a number', async () => {
    const result = await updateModel(undefined, TermLineInitial, 1);
    expect(result).toEqual({ data: false, message: err.m005 });
  }, 10000);

  it('should return an error if CurrentId is not provided or is not a number', async () => {
    const result = await updateModel(1, TermLineInitial, undefined);
    expect(result).toEqual({ data: false, message: err.m015 });
  }, 10000);

  it('should return an error if the record is not found', async () => {
    (isFound as jest.Mock).mockResolvedValue({ data: false });

    const result = await updateModel(1, TermLineInitial, 1);
    expect(result).toEqual({ data: false, message: err.m011 });
  }, 10000);

  it('should return an error if UpdateService.record fails to update the record', async () => {
    (isFound as jest.Mock).mockResolvedValue({ data: true });
    (UpdateService.record as jest.Mock).mockResolvedValue(false);

    const result = await updateModel(1, TermLineInitial, 1);
    expect(result).toEqual({ data: false, message: err.m003 });
  }, 10000);

  it('should return success if the record is updated successfully', async () => {
    (isFound as jest.Mock).mockResolvedValue({ data: true });
    (UpdateService.record as jest.Mock).mockResolvedValue(true);

    const result = await updateModel(1, TermLineInitial, 1);
    expect(result).toEqual({ data: true, message: Success.m004 });
  }, 10000);

  it('should handle exceptions and return the correct error message', async () => {
    (isFound as jest.Mock).mockImplementation(() => {
      throw new Error('Connection failed');
    });

    const result = await updateModel(1, TermLineInitial, 1);
    expect(result).toEqual({ data: false, message: err.m001 });
  }, 10000);
});
