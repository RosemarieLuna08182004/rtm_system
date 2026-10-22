import { isDefault } from '.';

describe('isDefault', () => {

    it('should message an error if Id is not a number', async () => {
        return expect(await isDefault(parseInt('asd'), 'TestTable')).toEqual({data: false,  message: 'Id must be a valid number'});
    });

    it('should message an error if Id is missing or not provided', async () => {
        return expect(await isDefault(undefined, 'TestTable')).toEqual({data: false,  message: 'Id must be a valid number'});
    });

    it('should throw an error if Table name is not a string', async () => {
        return expect(await isDefault(1, '')).toEqual({data: false,  message: 'Table must be provided as a non-empty string'});
    });

    it('should throw an error if Table name is missing or not provided', async () => {
        return expect(await isDefault(1, undefined)).toEqual({data: false,  message: 'Table must be provided as a non-empty string'});
    });
    
    it('should return false if Id is not found in the default record', async () => {
        return expect(await isDefault(111, 'user')).toEqual({data: false,  message: 'Id not found in the default record'});
    });
    it('should return true if Id and Table is valid', async () => {
        return expect(await isDefault(1, 'user')).toEqual({data: true,  message: 'Record found'});
    });
    

});
