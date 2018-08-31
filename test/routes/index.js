/* global require, it, describe, before, after, __dirname */
import chai, { expect } from 'chai';
import chaiThings from 'chai-things';
import supertest from 'supertest';
import app from '../../src/express';
import db from '../../src/db';

chai.use(chaiThings);

const serverURL = '/api';

const testUser = {
  userName: 'evalkneeval',
  email: 'eval@grandcanyon.com',
  firstName: 'Eval',
  lastName: 'Kneeval',
};

const password = 'M0t0rb1ke';

describe('user-server library API tests', () => {
  let request = null;
  let server = null;
  before((done) => {
    server = app.listen();
    request = supertest.agent(server);
    done();
  });

  after((done) => {
    server.close(() => {
      db.close();
      done();
    });
  });

  describe('register user', async () => {
    it('can register a user', async () => {
      const res = await request.post(`${serverURL}/register/`)
        .send({ password, ...testUser });
      const {
        status, body: {
          username,
          email,
          firstName,
          lastName,
        },
      } = res;
      expect(status).to.equal(201);
      expect(username).to.equal(testUser.username);
      expect(email).to.equal(testUser.email);
      expect(firstName).to.equal(testUser.firstName);
      expect(lastName).to.equal(testUser.lastName);
    });

    // FIXME: https://www.owasp.org/index.php/Testing_for_User_Enumeration_and_Guessable_User_Account_(OWASP-AT-002)
    it('can\'t register a user with an existing username', async () => {
      const { userName } = testUser;
      const dupeUser = {
        userName,
        firstName: 'Duplicate',
        lastName: 'User',
        email: 'live@thelyceum.com',
        password: 'T3st1ng',
      };
      try {
        await request.post(`${serverURL}/register/`)
          .send(dupeUser);
      } catch (e) {
        const {
          status,
          response: {
            body: {
              error,
            },
          },
        } = e;
        expect(status).to.equal(409);
        expect(error).to.equal('Username is invalid');
      }
    });

    const testInvalidUser = async (invalidUser) => {
      const res = await request.post(`${serverURL}/register/`)
        .send(invalidUser);
      const {
        status, body: {
          error,
        },
      } = res;
      expect(status).to.equal(400);
      expect(error).to.equal('Invalid user details - require userName, email, password');
    };

    it('can\'t register a user with missing email', async () => {
      await testInvalidUser({
        userName: 'DuplicateUser',
        firstName: 'Duplicate',
        lastName: 'User',
        password: 'T3st1ng',
      });
    });

    it('can\'t register a user with missing userName', async () => {
      await testInvalidUser({
        firstName: 'Duplicate',
        lastName: 'User',
        email: 'live@thelyceum.com',
        password: 'T3st1ng',
      });
    });

    it('can\'t register a user with missing password', async () => {
      await testInvalidUser({
        userName: 'DuplicateUser',
        firstName: 'Duplicate',
        lastName: 'User',
        email: 'live@thelyceum.com',
      });
    });
  });
});
