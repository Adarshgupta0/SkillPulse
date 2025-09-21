// services/auth.service.js

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;


const hashPassword = async (plainPassword) => {
  try {
    const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hashed;
  } catch (err) {
    console.error('Hashing error:', err.message);
    throw new Error('Password hashing failed');
  }
};


const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    console.error('Comparison error:', err.message);
    throw new Error('Password comparison failed');
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
