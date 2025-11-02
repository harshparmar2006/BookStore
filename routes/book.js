const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");

//add-book = admin role
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; //check its user or admin
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res.status(200).json({ message: "You have not access" });
    }
    const book = new Book({
      //added new book
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      description: req.body.description,
      language: req.body.language,
      image: req.body.image || "", // Save empty string if no image provided
    });
    await book.save();
    res.status(200).json({ message: "Book Added Succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//update-book
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { bookid } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "You have not access" });
    }
    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      description: req.body.description,
      language: req.body.language,
      image: req.body.image || "", // Save empty string if no image provided
    });
    return res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error Occured" });
  }
});

//Delete book
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { bookid } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "You have not access" });
    }
    await Book.findByIdAndDelete(bookid);
    return res.status(200).json({ message: "Book Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error Occured" });
  }
});

//get-all-book
router.get("/book/get-all-book", async (req, res) => {
  try {
    const book = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: "Success", data: book });
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
});

//get recent book limit-4
router.get("/get-recent-book", async (req, res) => {
  try {
    const book = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.status(200).json({ status: "Success", data: book });
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
});

//get-book-by-id
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json({ status: "Success", data: book });
  } catch (error) {
    res.status(500).json({ message: "An error occured" });
  }
});

module.exports = router;
