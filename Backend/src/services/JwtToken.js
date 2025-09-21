const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1d';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

const generateToken = (user) => {
    try {
        return jwt.sign(
            { email: user.email, id: user._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN, algorithm: 'HS256' }
        );
    } catch (error) {
        console.error('JWT Generation Error:', error);
        throw new Error('Token generation failed');
    }
};


module.exports = { generateToken };
