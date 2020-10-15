const request = require('supertest');
const Parents = require('../../api/parent/parentModel.js');
const server = require('../../api/app.js');

jest.mock('../../api/parent/parentModel.js');

jest.mock('../../api/middleware/authRequired.js', () =>
  jest.fn((req, res, next) => next())
);

jest.mock('../../api/middleware/jwtRestricted.js', () =>
  jest.fn((req, res, next) => next())
);

describe('testing the testing', () => {
  it('testing if jest is working', () => {
    expect(2).toBe(2);
  });
});

describe('profiles router endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /parent/:id', () => {
    it('should return 200', async () => {
      Parents.findById.mockResolvedValue({
        id: '1',
        pin: '1234',
        name: 'jeff',
        email: 'test@testing.com',
        admin: false,
      });
      Parents.getChildData.mockResolvedValue([
        {
          name: 'child1',
        },
        {
          name: 'child2',
        },
      ]);

      const res = await request(server).post('/parent/1').send({ pin: '1234' });
      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('logged in');
      expect(res.body.parent.id).toBe('1');
    });

    it('returns 400 if incorrect pin is entered', async () => {
      Parents.findById.mockResolvedValue({
        id: '1',
        pin: '1234',
        name: 'jeff',
        email: 'test@testing.com',
        admin: false,
      });
      const res = await request(server).post('/parent/1').send({ pin: '1235' });
      expect(res.status).toBe(400);
    });

    it('returns 400 if there is no pin sent', async () => {
      Parents.findById.mockResolvedValue({
        id: '1',
        pin: '1234',
        name: 'jeff',
        email: 'test@testing.com',
        admin: false,
      });
      const res = await request(server).post('/parent/1');
      expect(res.status).toBe(400);
    });
  });

  describe('POST /parent/:id/children', () => {
    it('should return 200 when a new child is created', async () => {
      Parents.findById.mockResolvedValue({
        id: '1',
        pin: '1234',
        name: 'jeff',
        email: 'test@testing.com',
        admin: false,
      });
      Parents.createChild.mockResolvedValue({
        id: 11,
        name: 'tim',
        writing_score: 50,
        current_mission: 1,
        avatar_url: 'fake/url.com',
      });
      const res = await request(server).post('/parent/1/children').send({
        name: 'tim',
        avatar_url: 'fake/url.com',
        pin: '4567',
        username: 'test123',
        grade: 5,
      });

      expect(res.status).toBe(200);
      expect(res.body.newChild.name).toBe('tim');
    });
  });
});
