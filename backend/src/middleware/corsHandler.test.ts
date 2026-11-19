import { corsHandler } from './corsHandler';

const run = (origin: string | undefined, method = 'GET') => {
  const headers: Record<string, string> = {};
  const res: any = {
    header: (k: string, v: string) => { headers[k] = v; return res; },
    status: jest.fn(() => res), end: jest.fn(() => res),
  };
  const next = jest.fn();
  corsHandler({ headers: origin ? { origin } : {}, method, path: '/api/v1/auth/refresh' } as any, res, next);
  return { headers, next, res };
};

describe('corsHandler', () => {
  it.each(['https://anatomytermsmorphology.com', 'https://www.anatomytermsmorphology.com', 'http://localhost:5173'])('allows %s', (origin) => {
    expect(run(origin).headers['Access-Control-Allow-Origin']).toBe(origin);
  });

  it('refuses local dev addresses in production', () => {
    const before = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      expect(run('http://localhost:5173').headers['Access-Control-Allow-Origin']).toBeUndefined();
      expect(run('https://anatomytermsmorphology.com').headers['Access-Control-Allow-Origin']).toBe('https://anatomytermsmorphology.com');
    } finally {
      process.env.NODE_ENV = before;
    }
  });

  it('does not echo unknown origins', () => {
    expect(run('https://evil.example').headers['Access-Control-Allow-Origin']).toBeUndefined();
  });

  it('lets the web admin send Refresh-Token, so sessions can be renewed', () => {
    const allowed = run('https://anatomytermsmorphology.com').headers['Access-Control-Allow-Headers'].split(',').map(h => h.trim().toLowerCase());
    expect(allowed).toEqual(expect.arrayContaining(['authorization', 'content-type', 'refresh-token']));
  });

  it('answers preflight requests without reaching the routes', () => {
    const { next, res } = run('https://anatomytermsmorphology.com', 'OPTIONS');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(next).not.toHaveBeenCalled();
  });
});
