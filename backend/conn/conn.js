const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const mongoUri = process.env.MONGO_URL;

if (!mongoUri) {
  throw new Error("MONGO_URL environment variable is not set");
}

const connection = mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  });

module.exports = connection;
