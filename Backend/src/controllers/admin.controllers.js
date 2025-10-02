const { validationResult } = require('express-validator');
const adminmodel = require("../models/admin.model");
const { createadmin } = require("../services/admin.create");
const { hashPassword, comparePassword } = require("../services/hashPassword")
const { generateToken } = require("../services/JwtToken");
const AdminOtpModel = require("../models/admin.otp.model")
const nodemailer = require("nodemailer");







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

module.exports.forgot_password = async function (req, res, next) {

    try {
        // console.log(process.env.NODEMAIL_PASS);

        const { email } = req.body;

        // Check if the admin already exists

        const admin = await adminmodel.findOne({ email: email })

        if (!admin) {
            return res.status(401).json({ message: "admin not found", success: false });
        }

        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

        await AdminOtpModel.deleteMany({ email: admin.email });

        const otpid = await AdminOtpModel.create({ email: admin.email, otp });

        const adminemail = admin.email;
        const name = admin.name;
        const adminotp = otpid.otp;


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

Your OTP: [${adminotp}]

This OTP is valid for the next 10 minutes. If you didn't request this, please ignore this email.

For security reasons, do not share this OTP with anyone.

Best regards,
[StudentHub] Team`

        await transporter.sendMail({
            from: '"Student app" <student@gmail.com>',
            to: adminemail,
            subject: "Reset Your Password - OTP Inside",
            text: textotp,
        });

        const token = generateToken(admin)

        res.cookie("otpAuthToken", token, {
            httpOnly: true,
          secure: true,
            sameSite: 'none',
            maxAge: 300000
        });

        return res.status(200).json({ message: "OTP send successfully", admin: admin, success: true });


    } catch (error) {
        console.error("foundadmin error", error.message);
        return res.status(504).json({ message: "foundadmin error", error: error, success: false })

    }



}
module.exports.otp_verify = async function (req, res, next) {


    try {

        const { otp } = req.body;
        const adminid = req.fogpassadminid;
        const admin = await adminmodel.findById(adminid);
        if (!admin) {
            return res.status(401).json({ message: "admin not found", success: false });
        }

        const adminofotp = await AdminOtpModel.findOne({ email: admin.email })
        const admindbotp = adminofotp.otp;

        if (parseInt(otp) !== parseInt(admindbotp)) {
            return res.status(401).json({ message: "Invalid OTP", success: false });
        }

        await AdminOtpModel.deleteOne({ _id: adminofotp._id });

        const token = generateToken(admin);

        res.cookie("changePassAuthToken", token, {
            httpOnly: true,
           secure: true,
            sameSite: 'none',
            maxAge: 300000
        });

        res.clearCookie("otpAuthToken", {
            httpOnly: true,
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

        const adminid = req.respassadminid;
        const admin = await adminmodel.findById(adminid);
        if (!admin) {
            return res.status(401).json({ message: "admin not found", success: false });
        }

        const hashedPassword = await hashPassword(newpassword);

        await adminmodel.findByIdAndUpdate(adminid, { password: hashedPassword }, { new: true });

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