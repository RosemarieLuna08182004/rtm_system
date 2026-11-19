import { EventEmitter } from 'events';
import { loginLimiter, resetLoginLimiter, MAX_FAILURES_PER_EMAIL, MAX_FAILURES_PER_ADDRESS } from './loginLimiter';

/** Runs one login attempt through the limiter; `status` is what the login handler would answer */
const attempt = (email: string, status: number, ip = '1.2.3.4') => {
  const res: any = new EventEmitter();
  res.statusCode = 200;
  res.status = jest.fn((code: number) => { res.statusCode = code; return res; });
  res.json = jest.fn(() => res);
  res.setHeader = jest.fn();
  const next = jest.fn(() => { res.statusCode = status; res.emit('finish'); });
  loginLimiter({ ip, body: { Email: email }, socket: {} } as any, res, next);
  return { blocked: !next.mock.calls.length, res };
};

describe('loginLimiter', () => {
  beforeEach(() => resetLoginLimiter());

  it(`blocks after ${MAX_FAILURES_PER_EMAIL} failures for the same email and address`, () => {
    for (let i = 0; i < MAX_FAILURES_PER_EMAIL; i++) expect(attempt('admin@example.com', 401).blocked).toBe(false);
    const { blocked, res } = attempt('admin@example.com', 200);
    expect(blocked).toBe(true);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.setHeader).toHaveBeenCalledWith('Retry-After', expect.any(String));
  });

  it('ignores letter case and spaces in the email', () => {
    for (let i = 0; i < MAX_FAILURES_PER_EMAIL; i++) attempt(' Admin@Example.com', 401);
    expect(attempt('admin@example.com', 200).blocked).toBe(true);
  });

  it("doesn't lock the real user out from their own address", () => {
    for (let i = 0; i < MAX_FAILURES_PER_EMAIL; i++) attempt('admin@example.com', 401, '6.6.6.6');
    expect(attempt('admin@example.com', 200, '1.2.3.4').blocked).toBe(false);
  });

  it('a successful login clears the count', () => {
    for (let i = 0; i < MAX_FAILURES_PER_EMAIL - 1; i++) attempt('admin@example.com', 401);
    attempt('admin@example.com', 200);
    for (let i = 0; i < MAX_FAILURES_PER_EMAIL - 1; i++) expect(attempt('admin@example.com', 401).blocked).toBe(false);
  });

  it(`caps one address at ${MAX_FAILURES_PER_ADDRESS} failures across many emails`, () => {
    for (let i = 0; i < MAX_FAILURES_PER_ADDRESS; i++) attempt(`user${i}@example.com`, 401);
    expect(attempt('someone.new@example.com', 200).blocked).toBe(true);
  });
});
