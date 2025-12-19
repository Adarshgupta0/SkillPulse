const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
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

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });

});

app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route Not Found" });
});

app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
    
  });
});

module.exports = app;
