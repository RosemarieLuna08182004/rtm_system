import { getByQuery } from '.';
import { pool } from '../../../config'

jest.mock('../../../config', () => ({
    pool: {
        execute: jest.fn(),
    },
}));

describe('getByQuery', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    it('should throw an error if Query is not a string', async () => {
        return await expect(getByQuery(undefined)).rejects.toThrow('Query must be provided as a non-empty string');
    });

    it('should throw an error if Query is missing or not provided', async () => {
        return await expect(getByQuery('')).rejects.toThrow('Query must be provided as a non-empty string');
    });
    
    it('should return rows if query and inputs are valid', async () => {
        const fakeResult = [{ Id: 1, Name: 'Test Record' }];
        (pool.execute as jest.Mock).mockResolvedValueOnce([fakeResult]);

        const result = await getByQuery('SELECT * FROM TestTable WHERE Id = 1');
        expect(result).toEqual(fakeResult);
    });
    
    it('should throw an error if pool connection fails', async () => {
        (pool.execute as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

        await expect(getByQuery('SELECT * FROM TestTable')).rejects.toThrow('Connection failed');
    });
});
