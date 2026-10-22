import { refreshToken } from '.';
import { Error, Success } from '../../../shared';
import { sign } from 'jsonwebtoken';

jest.mock('../../../config', () => ({
    SECRET_REFRESH_KEY: 'secret'
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('refreshToken', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error if UserId is 0', async () => {
        const result = await refreshToken(0);
        expect(result).toEqual({ data: null, message: Error.m012 });
    });

    it('should return an error if UserId is not a number', async () => {
        const result = await refreshToken('string' as unknown as number);
        expect(result).toEqual({ data: null, message: Error.m012 });
    });

    it('should return an error if UserId is NaN', async () => {
        const result = await refreshToken(NaN);
        expect(result).toEqual({ data: null, message: Error.m012 });
    });

    it('should return an error if SECRET_REFRESH_KEY is not set', async () => {
        jest.resetModules();
        jest.mock('../../../config', () => ({
            SECRET_REFRESH_KEY: undefined
        }));
        const result = await refreshToken(1);
        expect(result).toEqual({ data: null, message: Error.m003 });
    });

    it('should return an error if token is falsy', async () => {
        (sign as jest.Mock).mockReturnValue(null);

        const result = await refreshToken(1);
        expect(result).toEqual({ data: null, message: Error.m003 });
    });

    it('should return a success message with token when valid UserId is provided', async () => {
        const mockToken = 'mocked.token';
        (sign as jest.Mock).mockReturnValue(mockToken); 

        const result = await refreshToken(1);
        expect(result).toEqual({ data: mockToken, message: Success.m008 });
    });
});
