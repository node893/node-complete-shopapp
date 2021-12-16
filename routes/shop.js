const shopController = require('../controllers/shop');

const express = require('express');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductDetail);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/delete-product-from-cart', shopController.postCartDelete);

module.exports = router;