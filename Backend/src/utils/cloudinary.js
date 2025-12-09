require("dotenv").config(); // Ensure environment variables are loaded

const cloudinary = require("cloudinary").v2;

if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
    throw new Error("Cloudinary configuration is missing in environment variables.");
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

module.exports = cloudinary;
