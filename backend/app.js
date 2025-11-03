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
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.ADDITIONAL_ORIGIN,
        "http://localhost:5173",
      ].filter(Boolean);

      if (!origin) return callback(null, true);

      try {
        const hostname = new URL(origin).hostname;
        const isNetlify = /\.netlify\.app$/.test(hostname);
        const isAllowed = allowedOrigins.includes(origin) || isNetlify;
        return isAllowed ? callback(null, true) : callback(new Error("CORS blocked"));
      } catch (_) {
        return callback(new Error("CORS origin parse error"));
      }
    },
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
