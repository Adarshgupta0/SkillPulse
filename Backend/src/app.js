const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectToDb = require("./config/DBconnect");
connectToDb();
const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/user", userRouter);
app.use("/admin", adminRouter);



module.exports = app;
