const { validationResult } = require('express-validator');
const adminmodel = require("../models/admin.model");
const { createadmin } = require("../services/admin.create");
const { hashPassword, comparePassword } = require("../services/hashPassword")
const { generateToken } = require("../services/JwtToken");




module.exports.register = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Input error", errors: errors.array(), success: false });
    }
    try {
        const { name, email, password } = req.body;

        const admincount = await adminmodel.countDocuments();

        if (admincount >= 2) {
            return res.status(400).json({ message: "maximun 2 admin allowed", success: false })
        }

        const cheakbyemail = await adminmodel.findOne({ email })
        if (cheakbyemail) {
            return res.status(400).json({ message: "You already have an account, please login", success: false });
        }

        const hashpass = await hashPassword(password);
        const admin = await createadmin(name, email, hashpass);

        const token = generateToken(admin);


        res.cookie("adminAuthToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000 * 24,
        });

        return res.status(201).json({
            success: true,
            message: "Account created",
            admin: admin
        });




    } catch (error) {
        res.json({ success: false, registerError: error.message })
        console.log("Error:", error.message);
    }
}
module.exports.login = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Input error", errors: errors.array(), success: false })
    }

    try {
        const { email, password } = req.body;

        const admin = await adminmodel.findOne({ email }).select('+password');
        if (!admin) {
            return res.status(400).json({ message: "invaled email or password", success: false });
        }

        const isPasswordCorrect = await comparePassword(password, admin.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "invaled email or password", success: false });
        }

        const token = generateToken(admin);

        res.cookie("adminAuthToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000 * 24,
        });

        return res.status(201).json({
            success: true,
            message: "Account login",
            admin: admin
        });



    } catch (error) {
        res.json({ success: false, registerError: error.message })
        console.log("Error:", error.message);
    }

}
module.exports.logout = async function (req, res, next) {
    try {
        res.clearCookie("adminAuthToken", {
            httpOnly: true,
            sameSite: "strict"
        });
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error.message);
        return res.status(500).json({ success: false, message: "Logout failed", error: error.message });
    }

};