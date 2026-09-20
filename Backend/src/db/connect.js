const mongoose = require('mongoose');

const connectDB = async () => {
  // Connection state 1 (connected) ya 2 (connecting) hai to bypass karein
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_DB_URI, {
      bufferCommands: false, // Buffering disable karein taake timeouts na hon
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected via Request Trigger");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;