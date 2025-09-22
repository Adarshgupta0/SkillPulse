const { validationResult } = require('express-validator');
const usermodel = require("../models/user.model");
const otpmodel = require("../models/user.otp.model")
const { hashPassword, comparePassword } = require("../services/hashPassword")
const { createuser } = require("../services/user.create")
const { generateToken } = require("../services/JwtToken")
const nodemailer = require("nodemailer");



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

module.exports.forgot_password = async function (req, res, next) {

    try {
        const { email } = req.body;

        const user = await usermodel.findOne({ email: email })

        if (!user) {
            return res.status(401).json({ message: "user not found", success: false });
        }

        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

        await otpmodel.deleteMany({ email: user.email });

        const otpid = await otpmodel.create({ email: user.email, otp });

        const useremail = user.email;
        const name = user.name;
        const userotp = otpid.otp;


        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            auth: {
                user: process.env.NODEMAIL_EMAIL,
                pass: process.env.NODEMAIL_PASS
            },
        });

        let textotp = `Dear [${name}],

We received a request to reset your password. Use the OTP below to proceed with resetting your password.

Your OTP: [${userotp}]

This OTP is valid for the next 10 minutes. If you didn't request this, please ignore this email.

For security reasons, do not share this OTP with anyone.

Best regards,
[StudentHub] Team`

        await transporter.sendMail({
            from: '"Student app" <student@gmail.com>',
            to: useremail,
            subject: "Reset Your Password - OTP Inside",
            text: textotp,
        });

        const token = generateToken(user)

        res.cookie("otpAuthToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 300000*2
        });

        return res.status(200).json({ message: "OTP send successfully", user: user, success: true });


    } catch (error) {
        console.error("founduser error", error.message);
        return res.status(504).json({ message: "founduser error", error: error, success: false })

    }



}

module.exports.otp_verify = async function (req, res, next) {


    try {

        const { userotp } = req.body;
        const userid = req.userid;
        const user = await usermodel.findById(userid);
        if (!user) {
            return res.status(401).json({ message: "user not found", success: false });
        }

        const userofotp = await otpmodel.findOne({ email: user.email })
        const userdbotp = userofotp.otp;

        if (parseInt(userotp) !== parseInt(userdbotp)) {
            return res.status(401).json({ message: "Invalid OTP", success: false });
        }

        await otpmodel.deleteOne({ _id: userofotp._id });

        const token = generateToken(user);

        res.cookie("changePassAuthToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 300000*2
        });

        res.clearCookie("otpAuthToken", {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });



        return res.status(200).json({ message: "valed OTP", success: true });


    } catch (error) {
        console.error("otpverify error", error.message);
        return res.status(504).json({ message: "otpverify error", error: error, success: false })

    }

}

module.exports.change_password = async function (req, res, next) {

    try {

        const { newpassword } = req.body;

        const userid = req.userid;
        const user = await usermodel.findById(userid);
        if (!user) {
            return res.status(401).json({ message: "user not found", success: false });
        }

        const hashedPassword = await hashPassword(newpassword);

        await usermodel.findByIdAndUpdate(userid, { password: hashedPassword }, { new: true });

        res.clearCookie("changePassAuthToken", {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({ message: "Password updated successfully", success: true })


    } catch (error) {
        console.error("changepassword error", error.message);
        return res.status(504).json({ message: "changepassword error", error: error, success: false })
    }

}