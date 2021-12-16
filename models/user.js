const Product = require("./product");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (prodId) {
  let updatedItems;
  let updatedCart;
  if (this.cart.items.length > 0) {
    const existingProductIndex = this.cart.items.findIndex(
      (p) => p.productId.toString() === prodId.toString()
    );
    if (existingProductIndex >= 0) {
      updatedItems = [...this.cart.items];
      updatedItems[existingProductIndex].quantity += 1;
    } else {
      updatedItems = [...this.cart.items, { productId: prodId, quantity: 1 }];
    }
  } else {
    updatedItems = [{ productId: prodId, quantity: 1 }];
  }
  updatedCart = { items: updatedItems };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (prodId) {
  const updatedItems = this.cart.items.filter(
    (p) => p.productId.toString() !== prodId.toString()
  );

  this.cart = {
    items: updatedItems,
  };

  return this.save();
};

module.exports = mongoose.model("User", userSchema);
