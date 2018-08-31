import bcrypt from 'bcrypt';

const saltRounds = 10;

export const generateHash = async password => bcrypt.hash(password, saltRounds);

export const checkPassword = async (password, hash) => bcrypt.compare(password, hash);
