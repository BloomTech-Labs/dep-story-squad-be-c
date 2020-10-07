const request = require('supertest');
const Child = require('../../api/child/childModel');
const server = require('../../api/app.js');

jest.mock('../../api/child/childModel');

jest.mock('../../api/middleware/authRequired', () =>
  jest.fn((req, res, next) => next())
);

jest.mock('../../api/middleware/jwtRestricted', () =>
  jest.fn((req, res, next) => next())
);

describe('Test Suite', () => {
  it('tests if jest is working', () => {
    expect(3).toBe(3);
  });
});

describe('Child router endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const child = {
    id: 1,
    name: 'Billy',
    writing_score: 80,
    avatar_url: null,
    pin: '1234',
    type: 'child',
    username: 'BillyBob',
    dyslexic: 0,
    parent_id: 1,
    current_mission: 1,
  };

  describe('POST /child/:id', () => {
    it('should return 400 when nothing is sent', async () => {
      Child.findById.mockResolvedValue(child);
      const res = await request(server).post('/child/1').send({});

      expect(res.status).toBe(400);
    });

    it('should return 400 if no child sent', async () => {
      const res = await request(server).post('/child/1').send({ pin: '' });

      expect(res.status).toBe(400);
    });

    it('should return 400 if wrong pin', async () => {
      Child.findById.mockResolvedValue(child);
      const res = await request(server).post('/child/1').send({ pin: '1235' });

      expect(res.status).toBe(400);
    });

    // it('should return 200', async () => {
    //   Child.findById.mockResolvedValue(child);
    //   const res = await request(server).post('/child/1').send({ pin: '1234' });
    //   console.log(res.body);
    //   expect(res.status).toBe(200);
    // });
  });

  describe('GET /child/:id/mission', () => {});

  it('should allow multiple file uploads', async () => {
    Child.findById.mockResolvedValue(child);
    Child.addWriting.mockResolvedValue({});
    const res = await request(server)
      .post('/child/1/mission/write')
      .attach('image', '__tests__/surprised.jpg')
      .attach('image', '__tests__/surprised.jpg');
    expect(res.status).toBe(200);
  });

  it('should allow fingle file uploads', async () => {
    Child.findById.mockResolvedValue(child);
    Child.addWriting.mockResolvedValue({});
    const res = await request(server)
      .post('/child/1/mission/draw')
      .attach('image', '__tests__/surprised.jpg');
    expect(res.status).toBe(200);
  });
});
