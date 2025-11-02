const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

//sign-up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    //check username length is more than 3
    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username length should be greater than 3" });
    }

    //Username already exit or not
    const exitingUsername = await User.findOne({ username: username });
    if (exitingUsername) {
      return res.status(400).json({ message: "Username already exits!" });
    }

    //check email
    const exitingEmail = await User.findOne({ email: email });
    if (exitingEmail) {
      return res.status(400).json({ message: "Email already exits!" });
    }

    //check password length more than 5
    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "Password length should be greater than 5" });
    }
    //!password hasing
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      address: address,
    });
    await newUser.save();
    return res.status(200).json({ message: "Sign-up successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//sign-in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const exitingUser = await User.findOne({ username });
    if (!exitingUser) {
      return res.status(400).json({ message: "Invalid Cridentials" });
    }
    await bcrypt.compare(password, exitingUser.password, (err, data) => {
      if (data) {
        const authClaims = [
          {
            name: exitingUser.username,
            role: exitingUser.role,
          },
        ];

        const token = jwt.sign({ authClaims }, "bookStore123", {
          expiresIn: "30d",
        });

        return res
          .status(200)
          .json({ id: exitingUser._id, role: exitingUser.role, token: token });
      } else {
        res.status(400).json({ message: "Invalid Cridentials" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//update address
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({ message: "Address updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//update password
router.put("/update-password", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//update email
router.put("/update-email", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email is already taken
    const existingEmail = await User.findOne({ email, _id: { $ne: id } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await User.findByIdAndUpdate(id, { email });
    return res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
