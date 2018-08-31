import db from '.';
import logger from '../utils/logger';

export const DATABASE_ERROR = 'There was an error with the database';
export const INSERT_ERROR = 'There was an error adding the user';
export const INVALID_USER_ERROR = 'Invalid user details - require userName, email, password';

// FIXME (?) If we swapped the DB engine, we might end up with an async one so
// these functions should be async along with the route ones...
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

export const findBy = (key, value) => {
  const query = `SELECT * FROM users WHERE ${key}=?`;
  try {
    const result = db.prepare(query).get(value);
    logger.debug('findBy result ', result);
    return { user: result };
  } catch (error) {
    logger.error('findBy error: ', error);
    return { error: DATABASE_ERROR };
  }
};

export const validateUser = (user) => {
  const { userName, email, password } = user;
  if (!userName || !email || !password) {
    return { error: INVALID_USER_ERROR };
  }
  return { valid: true };
};
