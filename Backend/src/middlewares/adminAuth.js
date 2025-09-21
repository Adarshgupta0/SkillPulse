const adminmodel = require("../models/admin.model");
const jwt = require("jsonwebtoken");

module.exports.adminAuth = async function (req, res, next) {

    const token = req.cookies.adminAuthToken;
    if (!token) {
        return res.status(401).json({ message: "You need to login first", success: false });
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await adminmodel.findOne({ email: decode.email })
        if (!admin) {
            return res.status(401).json({ message: "admin not found", success: false })
        }

        req.admin = admin;
        return next();

    } catch (error) {
        console.error("authadmin error", error.message);
        return res.status(504).json({ message: "Invalid or expired token error", error: error, success: false })
    }

}




