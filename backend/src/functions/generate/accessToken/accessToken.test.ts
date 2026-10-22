import { accessToken } from '.';
import { Error, Success } from '../../../shared';
import { sign } from 'jsonwebtoken';

jest.mock('../../../config', () => ({
    SECRET_KEY: 'secret',
    TOKEN_EXPIRATION: '1h',
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('accessToken', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error if UserId is 0', async () => {
        const result = await accessToken(0);
        expect(result).toEqual({ data: null, message: Error.m012 });
    });

    it('should return an error if UserId is not a number', async () => {
        const result = await accessToken('string' as unknown as number); // Casting for TypeScript
        expect(result).toEqual({ data: null, message: Error.m012 });
    });

    it('should return an error if UserId is NaN', async () => {
        const result = await accessToken(NaN);
        expect(result).toEqual({ data: null, message: Error.m012 });
    });

    it('should return an error if SECRET_KEY is not set', async () => {
        jest.resetModules();
        jest.mock('../../../config', () => ({
            SECRET_KEY: undefined,
            TOKEN_EXPIRATION: '1h',
        }));
        const result = await accessToken(1);
        expect(result).toEqual({ data: null, message: Error.m003 });
    });

    it('should return an error if token is falsy', async () => {
        (sign as jest.Mock).mockReturnValue(null);

        const result = await accessToken(1);
        expect(result).toEqual({ data: null, message: Error.m003 });
    });

    it('should return a success message with token when valid UserId is provided', async () => {
        const mockToken = 'mocked.token';
        (sign as jest.Mock).mockReturnValue(mockToken); 

        const result = await accessToken(1);
        expect(result).toEqual({ data: mockToken, message: Success.m007 });
    });
});
