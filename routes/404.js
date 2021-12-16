const errorController = require('../controllers/error');

const express = require('express');

const router = express.Router();

router.get(errorController.get404);

module.exports = router;