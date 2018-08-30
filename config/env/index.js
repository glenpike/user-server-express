/* global process, require */
const env = process.env.NODE_ENV || 'development';
const config = require(`./${env}`).default; // eslint-disable-line import/no-dynamic-require

export default config;
