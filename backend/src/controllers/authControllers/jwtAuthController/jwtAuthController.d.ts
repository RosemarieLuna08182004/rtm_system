import request from 'supertest';
import { app, Shutdown } from '../../..';
import { API } from '../../../constants';

describe('JWTAuthController', () => {
    afterAll((done: any) => {
        Shutdown(done);
    });

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
        const response = await request(app).get(`${API}/auth/logout`);
        expect(response.status).toBe(200);
    }, 10000);
});
