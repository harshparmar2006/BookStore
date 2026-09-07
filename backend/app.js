const express = require("express");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");

require("dotenv").config();
const databaseConnection = require("./conn/conn");
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
        "http://localhost:5174",
      ].filter(Boolean);

      if (!origin) return callback(null, true);

      try {
        const hostname = new URL(origin).hostname;
        const isNetlify = /\.netlify\.app$/.test(hostname);
        const isAllowed = allowedOrigins.includes(origin) || isNetlify;
        return isAllowed
          ? callback(null, true)
          : callback(new Error("CORS blocked"));
      } catch (_) {
        return callback(new Error("CORS origin parse error"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

//routes
app.use("/", user);
app.use("/", book);
app.use("/", cart);
app.use("/", Order);

// Creating port
const PORT = process.env.PORT || 5000;

databaseConnection
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SERVER STARTED AT PORT ${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
