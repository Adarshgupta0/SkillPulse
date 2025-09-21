const usermodel = require("../models/user.model");

const createuser = async (name, email, password, userCategory) => {
    try {
        if (!name || !email || !password) {
            throw new Error('All fields are required');
        }

    
        const users = await usermodel.create({
            name,
            email,
            password,
            userCategory
        });

        return users;
    } catch (error) {
        console.error('Error in createuser:', error.message);
        throw new Error('Failed to create users');
    }
};

module.exports = { createuser };
