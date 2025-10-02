const express = require("express");
const { body } = require('express-validator');
const router = express.Router();
const { register, login, logout, forgot_password, otp_verify, change_password } = require("../controllers/admin.controllers");
const { adminAuth } = require("../middlewares/adminAuth")
const { otpAuth, changePassAuth } = require("../middlewares/adminChangePassAuth")


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
    adminAuth,
    logout
)
router.post("/forgot-password",
    forgot_password
)
router.post("/otp-verify",
    otpAuth,
    otp_verify
)
router.post("/change-password",
    changePassAuth,
    change_password
)

router.get("/check-otp-token",
    otpAuth,
    (req, res) => {
          try {
            res.send("otpAuth check")
        } catch (error) {
            res.json({error: error})
        }
    }
)
router.get("/check-changepassword-token",
    changePassAuth,
    (req, res) => {
        try {
            res.send("changePassAuth check")
        } catch (error) {
            res.json({error: error})
        }
    }
)





module.exports = router;