import db from './';
import logger from '../utils/logger';

export const DATABASE_ERROR = 'There was an error with the database';
export const INSERT_ERROR = 'There was an error adding the user';

export const addUser = (user) => {
  const {
    userName, email, firstName, lastName, password,
  } = user;
  const query = `INSERT INTO users (userName, email, firstName, lastName, password)
  VALUES(@userName, @email, @firstName, @lastName, @password)`;
  try {
    const result = db.prepare(query).run({
      userName, email, firstName, lastName, password,
    });
    logger.debug('addUser result ', result);
    const {
      changes,
      lastInsertROWID: id,
    } = result;
    if (changes !== 1) {
      return { error: INSERT_ERROR };
    }
    return { id };
  } catch (error) {
    logger.error('addUser error: ', error);
    return { error: DATABASE_ERROR };
  }
};
