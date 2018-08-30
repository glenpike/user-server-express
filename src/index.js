import app from './express';
import logger from './utils/logger';
import config from '../config/env';

app.listen(config.port, () => {
  logger.warn(`API started on ${config.port} (env: ${config.env})`);
});
