import { tableNumber } from '.';
import { GetService } from '../../../services';
import { DBTable, Error, Success } from '../../../shared';

jest.mock('../../../services', () => ({
    GetService: {
        byQuery: jest.fn(),
    },
}));

describe('tableNumber', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error if Table is not a non-empty string', async () => {
        const result = await tableNumber(DBTable.t000);
        expect(result).toEqual({ data: null, message: Error.m006 });
        
    });

    it('should return "00000001" when there are no entries in the table', async () => {
        const mockResponse = [{ Number: null }];
        (GetService.byQuery as jest.Mock).mockResolvedValue(mockResponse);

        const result = await tableNumber(DBTable.t001);
        expect(result).toEqual({ data: '00000001', message: Success.m001 });
    });

    it('should return "00000001" when MAX returns NaN', async () => {
        const mockResponse = [{ Number: 'not_a_number' }];
        (GetService.byQuery as jest.Mock).mockResolvedValue(mockResponse);

        const result = await tableNumber(DBTable.t001);
        expect(result).toEqual({ data: '00000001', message: Success.m001 });
    });

});
