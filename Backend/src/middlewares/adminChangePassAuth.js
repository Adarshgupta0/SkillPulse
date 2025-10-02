const adminmodel = require("../models/admin.model");
const jwt = require("jsonwebtoken");

module.exports.otpAuth = async function (req, res, next) {

    const token = req.cookies.otpAuthToken;
    if (!token) {
        return res.status(401).json({ message: "this route is unable", success: false });
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await adminmodel.findOne({ email: decode.email })
        if (!user) {
            return res.status(401).json({ message: "route error", success: false })
        }

        req.adminid = user._id;
        return next();

    } catch (error) {
        console.error("authUser error", error.message);
        return res.status(504).json({ message: "Invalid or expired token error", error: error, success: false })
    }

}

module.exports.changePassAuth = async function (req, res, next) {

    const token = req.cookies.changePassAuthToken;
    if (!token) {
        return res.status(401).json({ message: "this route is unable res", success: false });
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await adminmodel.findOne({ email: decode.email })
        if (!user) {
            return res.status(401).json({ message: "route error res", success: false })
        }

        req.adminid = user._id;
        return next();

    } catch (error) {
        console.error("authUser error", error.message);
        return res.status(504).json({ message: "Invalid or expired token error", error: error, success: false })
    }

}
