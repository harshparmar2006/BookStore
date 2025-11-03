const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // stop server if DB fails
  }
};

conn();
