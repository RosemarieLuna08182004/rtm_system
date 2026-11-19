import { withoutSecrets } from '.';

describe('withoutSecrets', () => {
  it('removes the password hash and stored tokens, keeping everything else', () => {
    const user = { Id: 16, Name: 'Admin', Email: 'admin@example.com', AccountType: 'administrator', Password: '$2b$10$hash', AccessToken: 'g-token', RefreshToken: 'r' };
    expect(withoutSecrets(user)).toEqual({ Id: 16, Name: 'Admin', Email: 'admin@example.com', AccountType: 'administrator' });
    expect(user.Password).toBe('$2b$10$hash'); // original untouched
  });

  it('passes through empty values', () => {
    expect(withoutSecrets(undefined)).toBeUndefined();
    expect(withoutSecrets(null)).toBeNull();
  });
});
