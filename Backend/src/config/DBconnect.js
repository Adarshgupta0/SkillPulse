const mongoose = require("mongoose");

async function connectToDb() {
  await mongoose.connect(process.env.DB_CONNECT);
  console.log("Connected to MongoDB");
}

module.exports = connectToDb;