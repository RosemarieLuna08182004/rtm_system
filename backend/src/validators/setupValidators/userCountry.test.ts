import { userValidatorOnCreate, userValidatorOnUpdate } from './user';
import { COUNTRIES, COUNTRY_CODES } from '../../shared/data/countries';

const signUp = { AccountType: 'user', Name: 'Juan Cruz', Email: 'juan@example.com', Password: 'password123' };

describe('user country', () => {
  it('has the 177 Google Play locations, each code once', () => {
    expect(COUNTRIES).toHaveLength(177);
    expect(new Set(COUNTRY_CODES).size).toBe(177);
    expect(COUNTRY_CODES.every(c => /^[A-Z]{2}$/.test(c))).toBe(true);
  });

  it('is optional at sign-up (older app versions), but must be on the list when sent', () => {
    expect(userValidatorOnCreate.validate({ ...signUp, Country: 'PH' }).error).toBeUndefined();
    expect(userValidatorOnCreate.validate(signUp).error).toBeUndefined();
    expect(userValidatorOnCreate.validate({ ...signUp, Country: 'XX' }).error?.message).toBe('Please choose a country from the list.');
    expect(userValidatorOnCreate.validate({ ...signUp, Country: 'ph' }).error).toBeDefined();
  });

  it('is optional on update, but still has to be on the list', () => {
    expect(userValidatorOnUpdate.validate({ Name: 'Juan' }).error).toBeUndefined();
    expect(userValidatorOnUpdate.validate({ Country: 'JP' }).error).toBeUndefined();
    expect(userValidatorOnUpdate.validate({ Country: 'Japan' }).error).toBeDefined();
  });
});
