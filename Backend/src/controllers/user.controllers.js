const { validationResult } = require('express-validator');
const usermodel = require("../models/user.model");
const { hashPassword, comparePassword } = require("../services/hashPassword")
const { createuser } = require("../services/user.create")
const { generateToken } = require("../services/JwtToken")




module.exports.register = async function (req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Input error", errors: errors.array(), success: false });
    }

    try {
        const { name, email, password, userCategory } = req.body;

        const userbyemail = await usermodel.findOne({ email });

        if (userbyemail) {
            return res.status(400).json({ message: "You already have an account, please login", success: false });
        }

        const hashedPW = await hashPassword(password);

        const user = await createuser(name, email, hashedPW, userCategory)

        const token = generateToken(user)

        res.cookie("userAuthToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000 * 24,
        });

        return res.status(201).json({
            success: true,
            message: "Account created",
            user: user
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
        console.log("Error:", error.message);
    }
};

module.exports.login = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Input error", errors: errors.array(), success: false });
    }

    try {
        const { email, password } = req.body;

        const user = await usermodel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "invaled email or password", success: false });
        }

        const isPasswordCorrect = await comparePassword(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "invaled email or password", success: false });
        }

        const responseuser = await usermodel.findOne({ email });

        const token = generateToken(responseuser)



        res.cookie("userAuthToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000 * 24,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: responseuser
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
        console.log("Error:", error.message);
    }
};

module.exports.logout = async function (req, res, next) {
    try {
        res.clearCookie("userAuthToken", {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error.message);
        return res.status(500).json({ success: false, message: "Logout failed", error: error.message });
    }

};