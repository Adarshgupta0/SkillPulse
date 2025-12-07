const { validationResult } = require('express-validator');
const usermodel = require("../models/user.model");
const otpmodel = require("../models/user.otp.model")
const lessonmodel = require('../models/lesson.model')
const tutorialmodel = require('../models/tutorial.model')
const roadmapmodel = require('../models/roadmap.model')
const quizmodel = require('../models/quiz.model')
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
            maxAge: 300000 * 2
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
            maxAge: 300000 * 2
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

        const userid = req.userid;
        const user = await usermodel.findById(userid);
        if (!user) {
            return res.status(401).json({ message: "user not found", success: false });
        }

        const hashedPassword = await hashPassword(newpassword);

        await usermodel.findByIdAndUpdate(userid, { password: hashedPassword }, { new: true });

        res.clearCookie("changePassAuthToken", {
            httpOnly: true,
            sameSite: "strict"
        });

        return res.status(200).json({ message: "Password updated successfully", success: true })


    } catch (error) {
        console.error("changepassword error", error.message);
        return res.status(504).json({ message: "changepassword error", error: error, success: false })
    }

}

module.exports.profile = async function (req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user data" });
        }

        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.error("Profile Error:", error.message);
        res.status(500).json({ success: false, message: "Profile fetch failed", error: error.message });
    }
};

module.exports.home = async function (req, res, next) {
    try {

        const user = await usermodel.findById(req.user._id);

        if (!user) {
            return res.status(400).json({ success: false, message: "user not find" })
        }

        const suggestedlesson = await lessonmodel.find({ "lesson_category": user.userCategory })

        if (!suggestedlesson) {
            return res.status(400).json({ success: false, message: "suggestedlesson not find" })
        }

        const suggestedtutorial = await tutorialmodel.find({ "tutorial_category": user.userCategory })

        if (!suggestedtutorial) {
            return res.status(400).json({ success: false, message: "tutorial not find" })
        }

        const roadmaps = await roadmapmodel.find({ "roadmap_category": user.userCategory })

        if (!roadmaps) {
            return res.status(400).json({ success: false, message: "roadmaps not find" })
        }


        return res.status(200).json({
            success: true,
            message: "homepage success",
            lessons: suggestedlesson,
            tutorials: suggestedtutorial,
            roadmaps: roadmaps
        })



    } catch (error) {
        console.error("home Error:", error.message);
        res.status(500).json({ success: false, message: "home fetch failed", error: error.message });
    }

};

module.exports.quiz = async function (req, res, next) {
    try {
        const user = await usermodel.findById(req.user);

        const quizes = await quizmodel.find({ "quizCategory": user.userCategory })
        if (!quizes) {
            return res.status(400).json({ success: false, message: "quizes not find" })
        }
        return res.status(200).json({ success: true, message: "quizes find", quizes: quizes })

    } catch (error) {
        console.error("quiz Error:", error.message);
        res.status(500).json({ success: false, message: "quiz fetch failed", error: error.message });
    }
}

module.exports.lesson = async function (req, res, next) {
    try {

        const lesson = await lessonmodel.find()

        if (!lesson) {
            return res.status(400).json({ success: false, message: " error lesson found" })
        }

        return res.status(200).json({
            success: true,
            message: lesson.length === 0 ? "No lesson found" : "lesson found",
            lessons: lesson
        });

    } catch (error) {
        console.error("lesson Error:", error.message);
        res.status(500).json({ success: false, message: "lesson fetch failed", error: error.message });
    }
}

module.exports.edit_profile = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "validationResult error", errors: errors.array(), success: false, })
    }
    try {
        const { name, email, userCategory } = req.body;

        const user = req.user;
        if (!user) {
            return res.status(400).json({ message: "url error", success: false, })
        }

        await usermodel.findOneAndUpdate({ _id: user._id }, { name, email, userCategory }, { new: true, runValidators: true })

        const newuser = await usermodel.findById(user._id);

        const token = generateToken(newuser)

        res.cookie("userAuthToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600000 * 24,
        });

        return res.status(200).json({ message: "user update", success: true, user: newuser });

    } catch (error) {
        console.error("editprofile Error:", error.message);
        res.status(500).json({ success: false, message: "editProfile error", error: error.message });
    }
}

module.exports.tutorial = async function (req, res, next) {

    try {
        const tutorial = await tutorialmodel.find().sort({ _id: -1 });

        if (!tutorial) {
            return res.status(500).json({ success: false, message: "tutorial fetch failed" });
        }
        return res.status(200).json({ success: true, message: "tutorial fetch", tutorial: tutorial });

    } catch (error) {
        console.error("tutorial Error:", error.message);
        res.status(500).json({ success: false, message: "tutorial fetch failed", error: error.message });
    }
}

module.exports.roadmap = async function (req, res, next) {
    try {
        const roadmap = await roadmapmodel.find().sort({ _id: -1 });

        if (!roadmap) {
            return res.status(500).json({ success: false, message: "roadmap fetch failed" });
        }
        return res.status(200).json({ success: true, message: "roadmap fetch", roadmap: roadmap });

    } catch (error) {
        console.error("roadmap Error:", error.message);
        res.status(500).json({ success: false, message: "roadmap fetch failed", error: error.message });
    }
}