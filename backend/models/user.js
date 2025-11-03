const mongoose = require("mongoose");
const user = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=http%3A%2F%2Fwallabarrow.co.uk%2Fhttp%2Far.inspiredpencil.com%2Fpictures-2023%2Fcontact-person-image&psig=AOvVaw3KUlQh7t5AXSKkaFB_hSed&ust=1761465014144000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIDh39nuvpADFQAAAAAdAAAAABAD",
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    favourite: [{
      type: mongoose.Types.ObjectId,
      ref: "books",
    }],
    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: "books",
      },
    ],
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "order",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("user",user);