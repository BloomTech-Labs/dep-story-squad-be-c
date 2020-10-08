const request = require('supertest');
const Child = require('../../api/child/childModel');
const childRouter = require('../../api/child/childRouter.js')
const server = require('../../api/app.js');

jest.mock('../../api/child/childModel');

jest.mock('../../api/middleware/authRequired', () =>
  jest.fn((req, res, next) => next())
);

jest.mock('../../api/middleware/jwtRestricted', () =>
  jest.fn((req, res, next) => next())
);

describe('Child router endpoints', () => {
  beforeAll(() => {
    server.use('/child', childRouter);
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

  describe('GET /child', () => {
    it('should return children and code 200', async () => {
      Child.findAll.mockResolvedValue([])
      const res = await request(server).get('/child');
      expect(res.status).toBe(200);
      expect(Child.findAll.mock.calls.length).toBe(1);
    });
  });

  it('should return 200', async () => {
    Child.findById.mockResolvedValue(child);
    const res = await request(server).post('/child/1').send({ pin: '1234' });
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.child.name).toBe('Billy');
    expect(Child.findAll.mock.calls.length).toBe(1);
  });

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
  });



  // it('should allow multiple file uploads', async () => {
  //   Child.findById.mockResolvedValue(child);
  //   Child.addWriting.mockResolvedValue({});
  //   const res = await request(server)
  //     .post('/child/1/mission/write')
  //     .attach('image', '__tests__/surprised.jpg')
  //     .attach('image', '__tests__/surprised.jpg');
  //   expect(res.status).toBe(200);
  // });

  // it('should allow fingle file uploads', async () => {
  //   Child.findById.mockResolvedValue(child);
  //   Child.addWriting.mockResolvedValue({});
  //   const res = await request(server)
  //     .post('/child/1/mission/draw')
  //     .attach('image', '__tests__/surprised.jpg');
  //   expect(res.status).toBe(200);
  // });
});
