const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

//putting book into the cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookinCart = userData.cart.includes(bookid);
    if (isBookinCart) {
      return res
        .status(200)
        .json({ status: "success", message: "Book is already in cart" });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.status(200).json({ message: "Book added to Cart" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Delete from cart
router.put("/remove-book-from-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookinCart = userData.cart.includes(bookid);
    if (isBookinCart) {
      await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
    }
    return res.status(200).json({ message: "Book removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart.reverse();
    return res.status(200).json({ status: "Success", data: cart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occured" });
  }
});
module.exports = router;
