import globalConfig from './global';

/* global process, require */
const env = process.env.NODE_ENV || 'development';
const envConfig = require(`./${env}`).default; // eslint-disable-line import/no-dynamic-require

const config = Object.assign(globalConfig, envConfig);

export default config;
