const request = require('supertest');
const express = require('express');
const Child = require('../../api/child/childModel.js');
const childRouter = require('../../api/child/childRouter.js');
const server = express();
server.use(express.json());

jest.mock('../../api/child/childModel.js');

jest.mock('../../api/middleware/authRequired.js', () =>
  jest.fn((req, res, next) => next())
);

jest.mock('../../api/middleware/jwtRestricted.js', () =>
  jest.fn((req, res, next) => next())
);

describe('Test Suite', () => {
  it('tests if jest is working', () => {
    expect(3).toBe(3);
  });
});

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

  describe('POST /child/:id', () => {
    it('should return 400 when nothing is sent', () => {
      Child.findById.mockResolvedValue(child);
      return request(server)
        .post('/child/1')
        .send({})
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });

    it('should return 400 if no child sent', () => {
      Child.findById.mockResolvedValue(null);
      return request(server)
        .post('/child/1')
        .send({ pin: '1234' })
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });

    it('should return 400 if wrong pin', () => {
      Child.findById.mockResolvedValue(child);
      return request(server)
        .post('/child/1')
        .send({ pin: '1235' })
        .then((res) => {
          expect(res.status).toBe(400);
        });
    });

    it('should return 200', () => {
      Child.findById.mockResolvedValue(child);
      return request(server)
        .post('/child/1')
        .send({ pin: '1234' })
        .then((res) => {
          console.log(child);
          expect(res.status).toBe(200);
        });
    });
  });

  it('should allow multiple file uploads', () => {
    Child.findById.mockResolvedValue(child);
    Child.addWriting.mockResolvedValue({});
    return request(server)
      .post('/child/1/mission/write')
      .attach('images', '__tests__/surprised.jpg')
      .attach('images', '__tests__/surprised.jpg')
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it('should allow fingle file uploads', () => {
    Child.findById.mockResolvedValue(child);
    Child.addWriting.mockResolvedValue({});
    return request(server)
      .post('/child/1/mission/draw')
      .attach('image', '__tests__/surprised.jpg')
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });
});
