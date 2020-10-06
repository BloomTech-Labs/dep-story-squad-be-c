const request = require('supertest');
// Full app so we can test the 404
const server = require('../../api/app.js');

describe('index router endpoints', () => {
  beforeAll(() => {});

  it('should use the test environment', () => {
    console.log(process.env.NODE_ENV)
    expect(process.env.NODE_ENV).toBe('test');
  });

  describe('GET /', () => {
    it('should return json with api:up', async () => {
      const res = await request(server).get('/');

      expect(res.status).toBe(200);
      expect(res.body.api).toBe('up');
    });
  });
});
