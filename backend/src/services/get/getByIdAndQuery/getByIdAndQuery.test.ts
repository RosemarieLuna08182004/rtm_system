import { getByIdAndQuery } from '.';
import { pool } from '../../../config'

jest.mock('../../../config', () => ({
    pool: {
        execute: jest.fn(),
    },
}));

describe('getByIdAndQuery', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if Id is not a number', async () => {
        return await expect(getByIdAndQuery(parseInt('asd'), 'TestTable')).rejects.toThrow('Id must be a valid number');
    });

    it('should throw an error if Id is missing or not provided', async () => {
        return await expect(getByIdAndQuery(undefined, 'SELECT * FROM TestTable WHERE Id = ?')).rejects.toThrow('Id must be a valid number');
    });

    it('should throw an error if Query is not a string', async () => {
        return await expect(getByIdAndQuery(1, '')).rejects.toThrow('Query must be provided as a non-empty string');
    });

    it('should throw an error if Query is missing or not provided', async () => {
        return await expect(getByIdAndQuery(1, undefined)).rejects.toThrow('Query must be provided as a non-empty string');
    });
    
    it('should return rows if query and inputs are valid', async () => {
        const fakeResult = [{ Id: 1, Name: 'Test Record' }];
        (pool.execute as jest.Mock).mockResolvedValueOnce([fakeResult]);

        const result = await getByIdAndQuery(1, 'SELECT * FROM TestTable WHERE Id = ?');
        expect(result).toEqual(fakeResult);
    });
    
    it('should throw an error if pool connection fails', async () => {
        (pool.execute as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

        await expect(getByIdAndQuery(1, 'SELECT * FROM TestTable')).rejects.toThrow('Connection failed');
    });
});
