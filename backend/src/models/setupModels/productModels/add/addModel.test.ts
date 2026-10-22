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

    it('should return an error if Id is not a number', async () => {
        const result = await addModel({ Name: 'test',Coins:0, Price:1, }, parseInt('asd'));
        expect(result).toEqual({ data: false, message: 'CurrentId is undefined or null' });
    }, 10000);

    it('should return an error if Id is undefined', async () => {
        const result = await addModel({ Name: 'test',Coins:0, Price:1, }, undefined);
        expect(result).toEqual({ data: false, message: 'CurrentId is undefined or null' });
    }, 10000);

    it('should return an error if Title is a duplicate', async () => {
        (isFound as jest.Mock).mockResolvedValue({ data: true, message: Error.m016 });

        const result = await addModel({ Name: 'test',Coins:0, Price:1, }, 1);
        expect(result).toEqual({ data: false, message: Error.m016 });
    }, 10000);

    it('should return an error if AddService fails', async () => {
        (isFound as jest.Mock).mockResolvedValue({ data: false, message: '' });
        (AddService.record as jest.Mock).mockResolvedValue(null);

        const result = await addModel({ Name: 'test',Coins:0, Price:1, }, 1);
        expect(result).toEqual({ data: false, message: Error.m003 });
    }, 10000);

    it('should return success if Title is added successfully', async () => {
        (isFound as jest.Mock).mockResolvedValue({ data: false, message: '' });
        (AddService.record as jest.Mock).mockResolvedValue({ id: 1 });

        const result = await addModel({ Name: 'test',Coins:0, Price:1, }, 1);
        expect(result).toEqual({ data: true, message: Success.m002 });
    }, 10000);
});
