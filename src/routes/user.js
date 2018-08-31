import express from 'express';
import logger from '../utils/logger';
import config from '../../config/env';
import { listUsers, findBy, deleteUser } from '../db/User';

const { API_KEY } = config;

const USER_NOT_FOUND_ERROR = 'User not found';

const getSafeUser = (user) => {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
};

const router = express.Router();

router.use((req, res, next) => {
  const { headers } = req;
  logger.debug('API_KEY:', config.API_KEY, ' headers ', headers);
  const xAPIKey = headers['x-api-key'];
  if (xAPIKey !== API_KEY) {
    return res.sendStatus(401);
  }
  return next();
});


router.get('/', (req, res, next) => {
  logger.info('GET user ');
  const { users, error: listError } = listUsers();
  if (listError) {
    logger.error('GET user listBy error: ', listError);
    res.status(500).send({ error: listError });
    return next();
  }
  const safeUsers = users.map(getSafeUser);
  return res.status(200).send(safeUsers);
});

router.get('/:id', (req, res, next) => {
  const { params: { id } } = req;
  logger.info('GET user ', id);
  const { user, error: findError } = findBy('id', id);
  if (findError) {
    logger.error('GET user findBy error: ', findError);
    res.status(500).send({ error: findError });
    return next();
  }
  if (!user) {
    res.status(404).send({ error: USER_NOT_FOUND_ERROR });
    return next();
  }
  return res.status(200).send(getSafeUser(user));
});

router.delete('/:id', (req, res, next) => {
  const { params: { id } } = req;
  logger.info('DELETE user ', id);
  const { user, error: findError } = findBy('id', id);
  if (findError) {
    logger.error('DELETE user findBy error: ', findError);
    res.status(500).send({ error: findError });
    return next();
  }
  if (!user) {
    res.status(404).send({ error: USER_NOT_FOUND_ERROR });
    return next();
  }
  const { error } = deleteUser(id);
  if (error) {
    logger.error('DELETE user deleteUser error: ', error);
    res.status(500).send({ error });
    return next();
  }
  return res.status(204).send();
});

export default router;
