import { getByTable } from '.';
import { pool } from '../../../config'
import { DBTable } from '../../../shared';

jest.mock('../../../config', () => ({
    pool: {
        execute: jest.fn(),
    },
}));

describe('getByTable', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });
    
    it('should throw an error if Table is not a string', async () => {
        return await expect(getByTable(undefined)).rejects.toThrow('Table must be provided as a valid non-empty string');
    });

    it('should throw an error if Table is missing or not provided', async () => {
        return await expect(getByTable(DBTable.t000)).rejects.toThrow('Table must be provided as a valid non-empty string');
    });
    
    it('should return rows if Table and inputs are valid', async () => {
        const fakeResult = [{ Id: 1, Name: 'Test Record' }];
        (pool.execute as jest.Mock).mockResolvedValueOnce([fakeResult]);

        const result = await getByTable(DBTable.t001);
        expect(result).toEqual(fakeResult);
    });
    
    it('should throw an error if pool connection fails', async () => {
        (pool.execute as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

        await expect(getByTable(DBTable.t001)).rejects.toThrow('Connection failed');
    });
});
