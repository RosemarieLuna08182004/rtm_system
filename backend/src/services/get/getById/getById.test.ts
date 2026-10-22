import { getById } from '.';
import { pool } from '../../../config'
import { DBTable } from '../../../shared';

jest.mock('../../../config', () => ({
    pool: {
        execute: jest.fn(),
    },
}));

describe('getById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if Id is not a number', async () => {
        return await expect(getById(parseInt('asd'), DBTable.t000)).rejects.toThrow('Id must be a valid number');
    });

    it('should throw an error if Id is missing or not provided', async () => {
        return await expect(getById(undefined, DBTable.t000)).rejects.toThrow('Id must be a valid number');
    });

    it('should throw an error if Table name is not a string', async () => {
        return await expect(getById(1, DBTable.t000)).rejects.toThrow('Table must be provided as a valid non-empty string');
    });

    it('should return rows if query and inputs are valid', async () => {
        const fakeResult = [{ Id: 1, Name: 'Test Record' }];
        (pool.execute as jest.Mock).mockResolvedValueOnce([fakeResult]);

        const result = await getById(1, DBTable.t001);
        expect(result).toEqual(fakeResult);
    });
    
    it('should throw an error if pool connection fails', async () => {
        (pool.execute as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

        await expect(getById(1, DBTable.t001)).rejects.toThrow('Connection failed');
    });
});
