/* global module */
import express from 'express';
import logger from '../utils/logger';
import { addUser } from '../db/User';

const router = express.Router();

router.post('/', (req, res, next) => {
  logger.debug('POST register ', req.body);
  const {
    userName, email, firstName, lastName, password,
  } = req.body;
  const user = {
    userName, email, firstName, lastName, password,
  };
  const { id, error } = addUser(user);
  if (error) {
    logger.error('POST register error: ', error);
    res.status(500).send(error);
    return next();
  }
  return res.status(201).send({ id, ...user });
});

export default router;
