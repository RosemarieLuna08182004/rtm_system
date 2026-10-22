import { addModel } from './';
import { Currency, SalesInitial, SalesTable } from '../../../../types';
import { GenerateFn } from '../../../../functions';
import { DBTable, Error as err, Success } from '../../../../shared';
import { AddService } from '../../../../services';

jest.mock('../../../../functions', () => ({
  GenerateFn: {
    tableNumber: jest.fn(),
  },
}));

jest.mock('../../../../services', () => ({
  AddService: {
    record: jest.fn(),
  },
}));

describe('addModel', () => {
  const mockData: SalesTable = {
      SalesNumber: '',
      DateCreated: new Date(),
      SalesDate: new Date(),
      TransactionId: '',
      UserId: 0,
      MerchantName: '',
      MerchantId: 0,
      ProductName: '',
      ProductPrice: 0,
      Currency: Currency.PHP,
      TotalAmount: 0,
      PaymentMethod: '',
      PaymentToken: '',
      ProductType: '',
      ProductId: 0,
      Status: 0
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if Data is not provided', async () => {
    const response = await addModel(undefined);
    expect(response).toEqual({ data: false, message: err.m001 });
  });

  it('should generate SalesNumber and set DateCreated when adding a new record', async () => {
    (GenerateFn.tableNumber as jest.Mock).mockResolvedValue({ data: DBTable.t004 });
    (AddService.record as jest.Mock).mockResolvedValue(true);

    const response = await addModel(mockData);

    expect(GenerateFn.tableNumber).toHaveBeenCalledWith(DBTable.t004);
    expect(AddService.record).toHaveBeenCalledWith(
      DBTable.t004,
      expect.any(Array),  // Fields
      expect.any(Array),  // Types
      expect.any(Array)   // Values
    );
    expect(response).toEqual({ data: true, message: Success.m002 });
    expect(mockData.SalesNumber).toBe(DBTable.t004);
  });

  it('should return an error if record could not be added', async () => {
    (GenerateFn.tableNumber as jest.Mock).mockResolvedValue({ data: DBTable.t004 });
    (AddService.record as jest.Mock).mockResolvedValue(false);

    const response = await addModel(mockData);

    expect(GenerateFn.tableNumber).toHaveBeenCalledWith(DBTable.t004);
    expect(AddService.record).toHaveBeenCalled();
    expect(response).toEqual({ data: false, message: err.m003 });
  });

});
