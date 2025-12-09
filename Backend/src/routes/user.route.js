const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/userAuth");

const { body } = require('express-validator');
const { register, login, logout, forgot_password, otp_verify, change_password, profile,
     home, lesson, quiz, edit_profile, tutorial, roadmap, auth_check } = require("../controllers/user.controllers")
const { otpAuth, changePassAuth } = require("../middlewares/changePassAuth")


router.post("/register", [
    body("email").isEmail().withMessage("Invalid Email"),
    body("name").isLength({ min: 3 }).withMessage("name must be at least 3 characters long"),
    body("password").isLength({ min: 6 }).withMessage("password must be at least 6 characters long"),
], register
)
router.post("/login", [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 6 }).withMessage("password must be at least 6 characters long"),
], login
)
router.get("/logout",
    userAuth,
    logout
)
router.post("/forgot-password",
    forgot_password
)
router.post("/otp-verify",
    otpAuth,
    otp_verify
)
router.put("/change-password",
    changePassAuth,
    change_password
)
router.get("/check-otp-token",
    otpAuth,
    (req, res) => {
        try {
            res.send("otpAuth check")
        } catch (error) {
            res.json({ error: error })
        }
    }
)
router.get("/check-changepassword-token",
    changePassAuth,
    (req, res) => {
        try {
            res.send("changePassAuth check")
        } catch (error) {
            res.json({ error: error })
        }
    }
)
router.get("/profile",
    userAuth,
    profile
)
router.get("/auth-check",
    userAuth,
    auth_check
)
router.get("/home",
    userAuth,
    home
)
router.get("/quiz",
    userAuth,
    quiz
)
router.get("/lesson",
    userAuth,
    lesson
)
router.put("/edit-profile", [
    body("email").isEmail().withMessage("Invalid Email"),
    body("name").isLength({ min: 3 }).withMessage("name must be at least 3 characters long"),
], userAuth,
   edit_profile
)
router.get("/tutorial",
    userAuth,
    tutorial
)
router.get("/roadmap",
    userAuth,
    roadmap
)




module.exports = router;