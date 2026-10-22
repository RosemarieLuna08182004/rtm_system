import { addRecord } from '.';
import { pool } from '../../../config'
import { DBTable } from '../../../shared';

jest.mock('../../../config', () => ({
    pool: {
        execute: jest.fn(),
    },
}));

describe('addRecord', () => {

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    it('should throw an error if Table is missing or not provided', async () => {
        await expect(addRecord( DBTable.t000, [''],[String],['test'])).rejects.toThrow('Table must be provided as a valid non-empty string');
    });

    it('should throw an error if Fields is not a non-empty array of strings', async () => {
        await expect(addRecord( DBTable.t001, [],[String],['string'])).rejects.toThrow('Field must be a non-empty array of strings');
    });

    it('should throw an error if Types array contains undefined values', async () => {
        await expect(addRecord( DBTable.t001, ['field1', 'field2'], [String, undefined], ['data1', 'data2'])).rejects.toThrow("Type for field'2' is undefined");
    });

    it('should throw an error if Datas array contains undefined values', async () => {
        await expect(addRecord( DBTable.t001, ['field1', 'field2'], [String, String], ['data1', undefined])).rejects.toThrow("Data for field'2' is undefined");
    });

    it('should fail if parameter lengths do not match', async () => {
        await expect(addRecord( DBTable.t001, ['field1'], [String], ['data1', 123])).rejects.toThrow('Parameters are empty, or their lengths do not match');
    });
    
    it('should return rows if query and inputs are valid', async () => {
        const fakeResult = true;
        (pool.execute as jest.Mock).mockResolvedValueOnce([fakeResult]);

        const result = await addRecord( DBTable.t001, ['Id'], [Number], [1]);
        expect(result).toEqual(fakeResult);
    });

    it('should throw an error if pool connection fails', async () => {
        (pool.execute as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

        await expect(addRecord( DBTable.t001, ['field1'], [String], ['data1'])).rejects.toThrow('Connection failed');
    });
});
