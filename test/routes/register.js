/* global require, it, describe, before, after, __dirname */
import chai, { expect } from 'chai';
import chaiThings from 'chai-things';
import request from 'superagent';
// import supertest from 'supertest';
// import app from '../../src/';
// import db from '../../src/db';

chai.use(chaiThings);

// const serverURL = '/api';
const serverURL = 'http://localhost:3000/api/';

const testUser = {
  userName: 'evalkneeval',
  email: 'eval@grandcanyon.com',
  firstName: 'Eval',
  lastName: 'Kneeval',
};

const password = 'M0t0rb1ke';

describe('user-server library API tests', () => {
  // let request = null;
  // let server = null;
  // before((done) => {
  //   server = app.listen(done);
  //   request = supertest.agent(server);
  // });

  // after((done) => {
  //   server.close(() => {
  //     db.close();
  //     done();
  //   });
  // });

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
    const res = await request.post(`${serverURL}/register/`)
      .send(dupeUser);
    const {
      status, body: {
        error,
      },
    } = res;
    expect(status).to.equal(409);
    expect(error).to.equal('Username is invalid');
  });

  it('can\'t register a user with missing email', async () => {
    const invalidUser = {
      firstName: 'Duplicate',
      lastName: 'User',
      email: 'live@thelyceum.com',
      password: 'T3st1ng',
    };
    const res = await request.post(`${serverURL}/register/`)
      .send(invalidUser);
    const {
      status, body: {
        error,
      },
    } = res;
    expect(status).to.equal(409);
    expect(error).to.equal('Invalid user details - require userName, email, password');
  });
});
