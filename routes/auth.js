const { check } = require("express-validator/check");

const authController = require("../controllers/auth");

const express = require("express");

const router = express.Router();

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Password should be atleast 5 charcters, and only enter numbers and alphabets"
    )
      .isAlphanumeric()
      .isLength({ min: 5 })
  ],
  authController.postSignup
);

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Password should be atleast 5 characters, and only enter numbers and alphabets"
    )
      .isAlphanumeric()
      .isLength({ min: 5 }),
  ],
  authController.postLogin
);

router.get('/logout', authController.getLogout);

module.exports = router;
