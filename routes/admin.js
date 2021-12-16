const { check } = require("express-validator");

const adminController = require("../controllers/admin");

const express = require("express");

const router = express.Router();

router.get("/add-product", adminController.getAddProduct);

router.post(
  "/add-product",
  [
      check("title", "Please enter a title").not().isEmpty(),
      check('price', "Please enter a price").not().isEmpty(),
      check('description', "Please enter a description").not().isEmpty(),
  ],
  adminController.postAddProduct
);

router.get('/products', adminController.getproducts);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.deleteProduct);

module.exports = router;
