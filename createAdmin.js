const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
require("dotenv").config();
require("./conn/conn");

async function createAdmin() {
  try {
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    const username = "admin";
    const email = "admin@bookstore.com";
    const password = "admin123";
    const address = "Admin Address";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username });
    
    if (existingAdmin) {
      console.log("✅ Admin user already exists!");
      console.log(`Username: ${username}`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const admin = new User({
      username,
      email,
      password: hashedPassword,
      address,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("You can now login with these credentials.");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();

