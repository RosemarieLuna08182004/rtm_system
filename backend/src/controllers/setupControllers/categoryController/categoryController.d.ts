import request from 'supertest';
import { app, Shutdown } from '../../..';
import { API } from '../../../constants';
import { TokenHandler } from '../../../middleware';

jest.mock('../../../middleware', () => ({
    TokenHandler: {
        verifyToken: jest.fn((req, res, next) => next()),
    }
}));

describe('CategoryController', () => {

  it('Starts and has the proper test environment', async () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(app).toBeDefined();
  }, 10000);

  it('Returns all options allowed when called from the HTTP method options', async () => {
    const response = await request(app).options('/');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-methods']).toBe('PUT, POST, PATCH, DELETE, GET');
  }, 10000);

  it('Returns 200 when the route requested is found.', async () => {
    const response = await request(app)
      .get(`${API}/category/get/1`)
      .set('Authorization', 'Bearer mock-token');

    expect(response.status).toBe(200);
  }, 10000);
});
