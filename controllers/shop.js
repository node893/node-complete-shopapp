const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  if(!req.user) {
    return res.redirect('/signup');
  }
  Product.find({userId: req.user._id}).then((products) => {
    res.render("shop/index", {
      pageTitle: "Shop",
      path: "index",
      products: products,
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id}).then((products) => {
    res.render("shop/products", {
      pageTitle: "Products",
      path: "shop",
      products: products,
    });
  });
};

exports.getProductDetail = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId).then((product) => {
    res.render("shop/product-detail", {
      pageTitle: "Product Detail",
      path: "shop",
      product: product,
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user.populate("cart.items.productId").then((user) => {
    const cartItems = user.cart.items;
    res.render("shop/cart", {
      pageTitle: "Cart",
      path: "cart",
      products: cartItems,
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.prodId;

  req.user.addToCart(productId)
  .then(() => {
    res.redirect('/cart');
  })
};

exports.postCartDelete = (req, res, next) => {
  const productId = req.body.prodId;

  req.user.removeFromCart(productId)
  .then(() => {
    res.redirect('/cart');
  })
};
