# Introduction

An Express example project for an API allowing users to register themselves and someone with an API Key to manipulate these users.

Written with JavaScript, [NodeJS](https://nodejs.org) and [Express](https://expressjs.com/)

Uses an [sqlite3](https://sqlite.org) database with a simple set of User functions that run direct queries using [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) npm package.  This is a synchronous library rather than the sqlite3 async one and it doesn't use an ORM because the functionality is very simple.

# Node

Tested on Node 8.11.4 - uses ES6 [import/export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and ES7 [async / await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) so check .babelrc for additional presets (this is using Babel 6 rather than 7 so will need an update)

# Setup

Clone this repository, run `npm install` or `yarn` to setup.

# Running

Run the server with `npm start` or `yarn start`, the server will start on port 3000 by default.  Use the environment variable PORT=XXXX to change, e.g.
`PORT=4000 npm run start`

The server will create an sqlite database in 'development.db' where it will persist any data.

See the tests for the different 'routes' available.

# Tests

Uses [Mocha](https://mochajs.org/), [Chai](http://www.chaijs.com/) and [SuperAgent](http://visionmedia.github.io/superagent/) for unit tests.

Run the tests with `npm test` or `yarn test`.

Testing will use an in-memory database.

# Linting

Uses [eslint](https://eslint.org/) together with the [AirBnB](https://github.com/airbnb/javascript) 'base' style rules.  See .eslintrc for overrides.

# TODO

 - [ ] Update Babel to v7 and fix the use of presets.
 - [ ] User 'auth': login & logout.
 - [ ] Allow user to change their profile.
 - [ ] Forgotten password reset (would require some kind of token / email system)