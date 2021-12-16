const Product = require("../models/product");
const fs = require("fs");

const { validationResult } = require("express-validator/check");

exports.getproducts = (req, res, next) => {
  Product.find({userId: req.user._id}).then((products) => {
    res.render("admin/products", {
      pageTitle: "Admin Products",
      path: "admin-products",
      products: products,
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "add-product",
    errorMessage: null,
    validationArray: [],
    oldData: { title: "", description: "", image: "", price: "" },
    editing: "false",
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "add-product",
      errorMessage: errors.array()[0].msg,
      validationArray: [],
      oldData: {
        title: title,
        price: price,
        description: description,
        image: image,
      },
      editing: "false",
    });
  }

  if (!image) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "add-product",
      errorMessage: "Please select image",
      validationArray: [],
      oldData: {
        title: title,
        price: price,
        description: description,
        image: image,
      },
      editing: "false",
    });
  }
  const imageUrl = image.path;
  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: userId,
  });
  product.save().then(() => {
    res.redirect("/admin/products");
  });
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  let editing = "false";
  if (req.query.edit) {
    editing = "true";
  }
  if (editing === "false") {
    return res.redirect("/admin/products");
  }

  Product.findOne({ _id: productId }).then((product) => {
    if (!product) {
      return res.redirect("/admin/products");
    } else {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "add-product",
        editing: editing,
        errorMessage: null,
        validationArray: [],
        oldData: {
          title: product.title,
          description: product.description,
          image: "",
          price: product.price,
          id: product._id,
        },
        product: product,
      });
    }
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.prodId;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;

  Product.findOne({ _id: id })
    .then((product) => {
      product.title = title;
      product.price = price;
      product.description = description;
      if (req.file) {
        fs.unlink(product.imageUrl, (err) => {
          console.log(err);
        });
        const image = req.file;
        product.imageUrl = image.path;
      }
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.body.prodId;

  Product.findById(productId)
    .then((product) => {
      fs.unlink(product.imageUrl, err => {
        console.log(err);
      })
      return Product.findByIdAndRemove(productId);
    })
    .then(() => {
      req.user.removeFromCart(productId);      
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};


