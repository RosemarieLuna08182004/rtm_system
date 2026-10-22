import { isFound } from './';
import { Success, Error } from '../../../shared';

jest.mock('./', () => ({
    isFound: jest.fn(),
}));

describe('isFound', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if Query name is not a string', async () => {
        (isFound as jest.Mock).mockResolvedValue({ data: false, message: Error.m010 });
        const result = await isFound(undefined, ['s'], [String], ['s']);
        expect(result).toEqual({ data: false, message: 'Query must be provided as a non-empty string' });
    }, 10000);

    it('should throw an error if Fields is not a non-empty array of strings', async () => {
        (isFound as jest.Mock).mockResolvedValue({ data: false, message: Error.m008 });
        const result = await isFound('SELECT * FROM TestTable', [], [String], ['string']);
        expect(result).toEqual({ data: false, message: 'Field must be a non-empty array of strings' });
    }, 10000);

    it('should throw an error if Types array contains undefined values', async () => {
        (isFound as jest.Mock).mockResolvedValue({ data: false, message: "Type for field'2' is undefined" });
        const result = await isFound('SELECT * FROM TestTable', ['field1', 'field2'], [String, undefined], ['data1', 'data2']);
        expect(result).toEqual({ data: false, message: "Type for field'2' is undefined" });
    }, 10000);

    it('should throw an error if Datas array contains undefined values', async () => {
        (isFound as jest.Mock).mockResolvedValue({ data: false, message: "Data for field'2' is undefined" });
        const result = await isFound('SELECT * FROM TestTable', ['field1', 'field2'], [String, String], ['data1', undefined]);
        expect(result).toEqual({ data: false, message: "Data for field'2' is undefined" });
    }, 10000);

    it('should fail if parameter lengths do not match', async () => {
        (isFound as jest.Mock).mockResolvedValue({ data: false, message: "Parameters are empty, or their lengths do not match" });
        const result = await isFound('SELECT * FROM TestTable', ['field1'], [String], ['data1', 123]);
        expect(result).toEqual({ data: false, message: 'Parameters are empty, or their lengths do not match' });
    }, 10000);

    it('should return true if query and inputs are valid', async () => {
        const mockResponse = { data: true, message: Success.m005 };
        (isFound as jest.Mock).mockResolvedValue(mockResponse);

        const result = await isFound('SELECT * FROM user', ['Id'], [Number], [1]);
        expect(result).toEqual({ data: true, message: Success.m005 });
    }, 10000);
});
