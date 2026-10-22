import { addModel } from './';
import { Success, Error } from '../../../../shared';
import { isFound } from '../../../../functions';
import { AddService } from '../../../../services';

jest.mock('../../../../functions', () => ({
    isFound: jest.fn(),
}));

jest.mock('../../../../services', () => ({
    AddService: {
        record: jest.fn(),
    },
}));

describe('addModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an error if AddService fails', async () => {
        (isFound as jest.Mock).mockResolvedValue({ data: false, message: '' });
        (AddService.record as jest.Mock).mockResolvedValue(null);

        const result = await addModel({ UserId: 1, Coins: 1, IsBundle:false });
        expect(result).toEqual({ data: false, message: Error.m003 });
    }, 10000);

    it('should return success if record is added successfully', async () => {
        (isFound as jest.Mock).mockResolvedValue({ data: false, message: '' });
        (AddService.record as jest.Mock).mockResolvedValue({ id: 1 });

        const result = await addModel({ UserId: 1, Coins: 1, IsBundle:false });
        expect(result).toEqual({ data: true, message: Success.m002 });
    }, 10000);
});
