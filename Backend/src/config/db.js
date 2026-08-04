const mongoose = require('mongoose');

require('dotenv').config();

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // stop the app if we can't reach the DB
  }
}

module.exports = connectDB;