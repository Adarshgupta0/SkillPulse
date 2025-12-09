const { validationResult } = require('express-validator');
const adminmodel = require("../models/admin.model");
const usermodel = require("../models/user.model");
const quizmodel = require("../models//quiz.model");
const { createadmin } = require("../services/admin.create");
const { hashPassword, comparePassword } = require("../services/hashPassword")
const { generateToken } = require("../services/JwtToken");
const AdminOtpModel = require("../models/admin.otp.model")
const nodemailer = require("nodemailer");
const sharp = require("sharp");
const cloudinary = require("../utils/cloudinary");
const lessonmodel = require("../models/lesson.model")




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
        const admin = req.admin;
        if (!admin) {
            return res.status(400).json({ success: false, message: "you need to login first" })
        }
        return res.status(200).json({ success: true, admin: admin })

    } catch (error) {
        res.status(400).json({ success: false, home: error.message })
        console.log("Error:", error.message);
    }
}
module.exports.edit_profile = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Input error", errors: errors.array(), success: false })
    }

    try {
        const admin = await adminmodel.findById(req.admin._id);

        const { name, email } = req.body;

        await adminmodel.findOneAndUpdate(
            { _id: admin._id },
            { name: name, email: email },
            { new: true, runValidators: true }
        );

        const newadmin = await adminmodel.findById(admin._id);

        const token = generateToken(newadmin);


        res.cookie("adminAuthToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600000 * 24,
        });


        return res.status(200).json({ message: "admin update", success: true, admin: newadmin })



    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
        console.log("Error:", error.message);
    }
}
module.exports.auth_check = async function (req, res, next) {
    try {
        if (!req.admin) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        res.status(200).json({ success: true, message: "Authorized" });
    } catch (error) {
        res.status(500).json({ success: false, message: "authcheck fetch failed", error: error.message });
    }
}

module.exports.all_users = async function (req, res, next) {
    try {
        const allusers = await usermodel.find().sort({ _id: -1 });
        if (!allusers) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        return res.status(200).json({ success: true, allusers: allusers })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
        console.log("Error:", error.message);
    }

}
module.exports.delete_user = async function (req, res, next) {
    try {
        const { userid } = req.params;
        const user = await usermodel.findByIdAndDelete(userid);
        if (!user) {
            return res.status(400).json({ success: false, message: "user not found" })
        }
        return res.status(200).json({ success: true, message: "User deleted successfully!" })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
        console.log("Error:", error.message);
    }
}

module.exports.quiz_create = async function (req, res, next) {

    try {

        const { quiz, quizCategory, options } = req.body;

        if (!quiz || !Array.isArray(options) || options.length !== 4) {
            return res.status(400).json({ message: "Quiz must have 4 options", success: false });
        }

        const correctCount = options.filter(opt => opt.isCorrect).length;
        if (correctCount !== 1) {
            return res.status(400).json({ message: "Exactly one option must be correct", success: false });
        }

        const newquiz = await quizmodel.create({ quiz, quizCategory, options });

        return res.status(201).json({ success: true, message: "Quiz created", quiz: newquiz });


    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
        console.log("Error:", error.message);
    }



}
module.exports.all_quizzes = async function (req, res, next) {
    try {
        const allquizs = await quizmodel.find().sort({ _id: -1 });
        if (!allquizs) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        return res.status(200).json({ success: true, allquizs: allquizs })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
        console.log("Error:", error.message);
    }
}
module.exports.quiz_update = async function (req, res, next) {
    try {
        const { quiz, quizCategory, options } = req.body;
        const { quizId } = req.params;

        const quizcheak = await quizmodel.findById(quizId);

        if (!quizcheak) return res.status(400).json({ message: "quiz not found", success: false });


        if (!quiz || !Array.isArray(options) || options.length !== 4 || !quizCategory) {
            return res.status(400).json({ message: "Quiz must have 4 options", success: false });
        }

        const correctCount = options.filter(opt => opt.isCorrect).length;
        if (correctCount !== 1) {
            return res.status(400).json({ message: "Exactly one option must be correct", success: false });
        }

        const updatequiz = await quizmodel.findByIdAndUpdate(quizId, { $set: { quiz: quiz, quizCategory: quizCategory, options: options } }, { new: true, runValidators: true })

        if (!updatequiz) return res.status(400).json({ message: "quiz updating error", success: false });

        const allquizs = await quizmodel.find().sort({ _id: -1 });

        if (!allquizs) {
            return res.status(400).json({ success: false, message: "allquizs not found" })
        }

        return res.status(200).json({ message: "quiz updated", success: true, allquizs: allquizs });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
        console.log("Error:", error.message);

    }
}
module.exports.quiz_delete = async function (req, res, next) {

    try {
        const { quizId } = req.params;
        const quiz = await quizmodel.findByIdAndDelete(quizId);
        if (!quiz) {
            return res.status(400).json({ success: false, message: "URL is incorrect" })
        }
        return res.status(200).json({ success: true, message: "quiz deleted successfully!" })
    } catch (error) {
        res.status(400).json({ success: false, message: "quiz delete error", error: error.message })
        console.log("Error:", error.message);
    }
}

module.exports.lesson_create = async function (req, res, next) {
    try {
        const { title, description, lessonlink, lesson_category } = req.body;
        const thumbnail = req.file?.buffer;

        // Validate input
        if (!thumbnail) {
            return res.status(400).json({ message: "Thumbnail required", success: false });
        }
        if (!title || !description || !lessonlink || !lesson_category) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        // Optimize image
        const optimizedImageBuffer = await sharp(thumbnail)
            .resize({ width: 800, height: 800 })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();

        // Convert to Data URI
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

        // Upload to Cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUri, {
            folder: "lessons", // optional: organize in Cloudinary
            overwrite: true,
        });

        // Save lesson in DB
        const lesson = await lessonmodel.create({
            title,
            description,
            lessonlink,
            thumbnail: cloudResponse.secure_url,
            public_thumbnail: cloudResponse.public_id,
            lesson_category,
        });

        if (!lesson) {
            return res.status(500).json({ message: "lesson not created", success: false });
        }

        // Success response
        return res.status(201).json({
            message: "lesson created successfully",
            success: true,
            lesson: lesson,
        });

    } catch (error) {
        console.error("lessoncreate Error:", error.message);
        return res.status(500).json({ success: false, message: error.message, error: error });
    }
};
module.exports.all_lessons = async function (req, res, next) {
    try {
        const alllesson = await lessonmodel.find().sort({ _id: -1 });

        if (!alllesson || alllesson.length === 0) {
            return res.status(404).json({ success: false, message: "No lessons found" });
        }

        return res.status(200).json({
            success: true,
            count: alllesson.length, // optional: total lesson
            lessons: alllesson
        });

    } catch (error) {
        console.error("Get All lessons Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }

}
module.exports.lesson_update = async function (req, res, next) {
    try {
        const { lessonId } = req.params; // lesson id from URL
        const { title, description, lessonlink, lesson_category } = req.body;

        const lesson = await lessonmodel.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ success: false, message: "lesson not found" });
        }

        if (!title || !description || !lessonlink || !lesson_category) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        let updatedThumbnail;
        let public_thumbnail;

        // If new thumbnail uploaded → optimize + upload
        if (req.file?.buffer) {
            if (lesson.public_thumbnail) {
                await cloudinary.uploader.destroy(lesson.public_thumbnail);

            }

            const optimizedImageBuffer = await sharp(req.file.buffer)
                .resize({ width: 800, height: 800 })
                .toFormat("jpeg", { quality: 80 })
                .toBuffer();



            const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
            const cloudResponse = await cloudinary.uploader.upload(fileUri, {
                folder: "lessons",
                overwrite: true,
            });

            updatedThumbnail = cloudResponse.secure_url;
            public_thumbnail = cloudResponse.public_id;
        }

        // Update lesson using findByIdAndUpdate
        const updatedlesson = await lessonmodel.findByIdAndUpdate(
            lessonId,
            {
                title,
                description,
                lessonlink,
                lesson_category,
                ...(public_thumbnail && { public_thumbnail: public_thumbnail }),
                ...(updatedThumbnail && { thumbnail: updatedThumbnail })
            },
            { new: true } // return updated document
        );

        if (!updatedlesson) {
            return res.status(404).json({ success: false, message: "lesson not found" });
        }

        const alllesson = await lessonmodel.find().sort({ _id: -1 });

        if (!alllesson || alllesson.length === 0) {
            return res.status(404).json({ success: false, message: "No lesson found" });
        }

        return res.status(200).json({
            success: true,
            message: "lesson updated successfully",
            lessons: alllesson 
        });

    } catch (error) {
        console.error("lesson Edit Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
module.exports.lesson_delete = async function (req, res, next) {
    try {
        const { lessonId } = req.params;

        // Find lesson first
        const lesson = await lessonmodel.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ success: false, message: "lesson not found" });
        }

        // Optional: delete old image from Cloudinary
        if (lesson.thumbnail) {
            try {
                // Extract public_id from Cloudinary URL
                const publicId = lesson.public_thumbnail;
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.warn("Cloudinary delete failed:", err.message);
            }
        }

        // Delete lesson from DB
        await lessonmodel.findByIdAndDelete(lessonId);

        return res.status(200).json({
            success: true,
            message: "Lessons deleted successfully!",
        });

    } catch (error) {
        console.error("lesson Delete Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};