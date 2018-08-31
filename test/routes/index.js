/* global require, it, describe, before, after, __dirname */
import chai, { expect } from 'chai';
import chaiThings from 'chai-things';
import supertest from 'supertest';
import app from '../../src/express';
import db from '../../src/db';
import config from '../../config/env';

const { API_KEY } = config;

chai.use(chaiThings);

const serverURL = '/api';

const testUser = {
  userName: 'evalkneeval',
  email: 'eval@grandcanyon.com',
  firstName: 'Eval',
  lastName: 'Kneeval',
};

const secondUser = {
  userName: 'seconduser',
  email: 'live@thelyceum.com',
  firstName: 'Second',
  lastName: 'User',
  password: 'T3st1ng',
};

const password = 'M0t0rb1ke';

describe('user-server library API tests', () => {
  let request = null;
  let server = null;

  let testUserId;
  let secondUserId;

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
    const testRegisterUser = async (user, expectedStatus = 201) => {
      const res = await request.post(`${serverURL}/register/`)
        .send(user);
      const {
        status,
      } = res;
      expect(status).to.equal(expectedStatus);
      return res;
    };

    it('can register a user', async () => {
      const {
        body: {
          id,
          username,
          email,
          firstName,
          lastName,
        },
      } = await testRegisterUser({ password, ...testUser });
      expect(id).to.not.equal(undefined);
      testUserId = id;
      expect(username).to.equal(testUser.username);
      expect(email).to.equal(testUser.email);
      expect(firstName).to.equal(testUser.firstName);
      expect(lastName).to.equal(testUser.lastName);
    });

    // FIXME: https://www.owasp.org/index.php/Testing_for_User_Enumeration_and_Guessable_User_Account_(OWASP-AT-002)
    it('can\'t register a user with an existing username', async () => {
      const { userName } = testUser;
      const dupeUser = { ...secondUser, userName };
      const {
        body: {
          error,
        },
      } = await testRegisterUser(dupeUser, 409);
      expect(error).to.equal('Username is invalid');
    });

    const testInvalidUser = async (invalidUser) => {
      const {
        body: {
          error,
        },
      } = await testRegisterUser(invalidUser, 400);
      expect(error).to.equal('Invalid user details - require userName, email, password');
    };

    it('can\'t register a user with missing email', async () => {
      const invalidUser = { ...secondUser };
      delete invalidUser.email;
      await testInvalidUser(invalidUser);
    });

    it('can\'t register a user with missing userName', async () => {
      const invalidUser = { ...secondUser };
      delete invalidUser.userName;
      await testInvalidUser(invalidUser);
    });

    it('can\'t register a user with missing password', async () => {
      const invalidUser = { ...secondUser };
      delete invalidUser.password;
      await testInvalidUser(invalidUser);
    });

    it('can register a user with missing firstName & lastName', async () => {
      const invalidUser = { ...secondUser };
      delete invalidUser.firstName;
      delete invalidUser.lastName;
      const { body: { id } } = await testRegisterUser(invalidUser);
      expect(id).to.not.equal(undefined);
      secondUserId = id;
    });
  });

  describe('user functions', async () => {
    const testListUsers = async (expectedStatus = 200) => {
      const res = await request.get(`${serverURL}/user/`).set('X-API-KEY', API_KEY);
      const {
        status,
      } = res;
      expect(status).to.equal(expectedStatus);
      return res;
    };

    it('can list users with the API key', async () => {
      const { body } = await testListUsers();
      expect(body.length).to.equal(2);
      const [user1, user2] = body.sort((a, b) => a.username - b.username);
      expect(user1.userName).to.equal(testUser.userName);
      expect(user2.userName).to.equal(secondUser.userName);
    });

    it('doesn\'t return passwords in user list', async () => {
      const { body } = await testListUsers();
      body.forEach((user) => {
        expect(user.password).to.equal(undefined);
      });
    });

    const testGetUser = async (id, expectedStatus = 200) => {
      const res = await request.get(`${serverURL}/user/${id}`).set('X-API-KEY', API_KEY);
      const {
        status,
      } = res;
      expect(status).to.equal(expectedStatus);
      return res;
    };

    it('can get a user with the API key', async () => {
      const {
        body,
      } = await testGetUser(testUserId);
      expect(body.id).to.equal(testUserId);
      Object.keys(testUser).forEach((key) => {
        if (key === 'password') {
          expect(body[key]).to.equal(undefined);
        } else {
          expect(body[key]).to.equal(testUser[key]);
        }
      });
    });

    it('will return an error for getting a missing user', async () => {
      const {
        body: {
          error,
        },
      } = await testGetUser('invalid-id', 404);
      expect(error).to.equal('User not found');
    });

    const testDeleteUser = async (id, expectedStatus = 204) => {
      const res = await request.delete(`${serverURL}/user/${id}`).set('X-API-KEY', API_KEY);
      const {
        status,
      } = res;
      expect(status).to.equal(expectedStatus);
      return res;
    };

    it('can delete a user with the API key', async () => {
      const {
        body,
      } = await testDeleteUser(secondUserId);
      // Express returns an empty object - possibly because of the JSON bodyParser?
      expect(body).to.be.empty; // eslint-disable-line no-unused-expressions
    });

    it('will return a 404 for the deleted user', async () => {
      const {
        body: {
          error,
        },
      } = await testGetUser(secondUserId, 404);
      expect(error).to.equal('User not found');
    });

    it('will return an error for deleting a missing user', async () => {
      const {
        body: {
          error,
        },
      } = await testDeleteUser('invalid-id', 404);
      expect(error).to.equal('User not found');
    });

    it('will only list a single user after one is deleted', async () => {
      const { body } = await testListUsers();
      expect(body.length).to.equal(1);
      const [user1] = body;
      expect(user1.userName).to.equal(testUser.userName);
    });
  });
});
