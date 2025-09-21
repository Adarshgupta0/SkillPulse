const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/userAuth");

const { body } = require('express-validator');
const { register, login, logout } = require("../controllers/user.controllers")


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




module.exports = router;