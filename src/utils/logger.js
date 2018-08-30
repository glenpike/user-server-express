import bunyan from 'bunyan'; // eslint-disable-line import/no-extraneous-dependencies
import os from 'os';
import path from 'path';

export const logConfig = {
  name: 'user-server',
  level: 'debug',
};

if (process.env.NODE_ENV === 'test') {
  const tmpPath = path.join(os.tmpdir(), 'user-server.log');
  logConfig.streams = [
    {
      path: tmpPath,
    },
  ];
} else {
  logConfig.stream = process.stdout;
}

const logger = bunyan.createLogger(logConfig);

export default logger;
