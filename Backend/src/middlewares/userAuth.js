const usermodel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.userAuth = async function (req, res, next) {

    const token = req.cookies.userAuthToken;
    if (!token) {
        return res.status(401).json({ message: "You need to login first", success: false });
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usermodel.findOne({ email: decode.email })
        if (!user) {
            return res.status(401).json({ message: "user not found", success: false })
        }

        req.user = user;
        return next();

    } catch (error) {
        console.error("authUser error", error.message);
        return res.status(504).json({ message: "Invalid or expired token error", error: error, success: false })
    }

}




