/* global module */
import express from 'express';
import logger from '../utils/logger';
import { addUser, findBy, validateUser } from '../db/User';

const router = express.Router();

const USER_EXISTS_ERROR = 'Username is invalid';

router.post('/', (req, res, next) => {
  logger.debug('POST register ', req.body);
  const {
    userName, email, firstName, lastName, password,
  } = req.body;
  const user = {
    userName, email, firstName, lastName, password,
  };
  const { error: validationError } = validateUser(user);
  if (validationError) {
    logger.error('POST register validateUser error: ', validationError);
    res.status(400).send({ error: validationError });
    return next();
  }
  const { user: existingUser, error: findError } = findBy('userName', userName);
  if (findError) {
    logger.error('POST register findBy error: ', findError);
    res.status(500).send({ error: findError });
    return next();
  }
  if (existingUser) {
    logger.error('POST register findBy user exists: ', existingUser);
    res.status(409).send({ error: USER_EXISTS_ERROR });
    return next();
  }
  const { id, error } = addUser(user);
  if (error) {
    logger.error('POST register addUser error: ', error);
    res.status(500).send({ error });
    return next();
  }
  return res.status(201).send({ id, ...user });
});

export default router;
