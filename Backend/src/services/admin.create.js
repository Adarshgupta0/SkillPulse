const adminmodel = require("../models/admin.model");

const createadmin = async (name, email, password) => {
    try {
        if (!name || !email || !password) {
            throw new Error('All fields are required');
        }
        const admin = await adminmodel.create({
            name,
            email,
            password,
        })

        return admin;


    } catch (error) {
        console.error('Error in createuser:', error.message);
        throw new Error('Failed to create users');
    }

}

module.exports = {createadmin};