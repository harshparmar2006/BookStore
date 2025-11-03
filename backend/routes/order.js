const router = require("express").Router();
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");
const Order = require("../models/order");
const User = require("../models/user");

router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;
    const savedOrders = [];
    
    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();
      savedOrders.push(orderDataFromDb._id);
    }

    //Saving order in user model
    await User.findByIdAndUpdate(id, { $push: { orders: { $each: savedOrders } } });

    //clearinig cart - remove all ordered books from cart
    const bookIds = order.map(item => item._id);
    await User.findByIdAndUpdate(id, { $pullAll: { cart: bookIds } });
    
    return res
      .status(200)
      .json({ status: "Success", message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occured" });
  }
});

//get order history
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });
    const orderData = userData.orders.reverse();
    return res.status(200).json({ status: "Success", data: orderData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occured" });
  }
});

//get all orders --admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({
        path: "book",
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({ status: "Success", data: "userData" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occured" });
  }
});

//update order-admin role
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: "req.body.status" });
    return res
      .status(200)
      .json({ status: "Success", message: "Status updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occured" });
  }
});

module.exports = router;
