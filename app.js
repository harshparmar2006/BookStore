const express = require("express");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");
require("dotenv").config();
require("./conn/conn");
const user = require("./routes/user");
const book = require("./routes/book");
const cart = require("./routes/cart");
const Order = require("./routes/order");
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//routes
app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", cart);
app.use("/api/v1", Order);

// Creating port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SERVER STARTED AT PORT ${PORT}`);
});
