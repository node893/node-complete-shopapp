const { validationResult } = require("express-validator/check");
const User = require("../models/user");

const bcryptjs = require("bcryptjs");
const session = require("express-session");
const user = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "login",
    oldData: { email: "", password: "" },
    errorMessage: null,
    validationArray: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("auth/login", {
      pageTitle: "Login",
      path: "login",
      oldData: { email: email, password: password },
      errorMessage: errors.array()[0].msg,
      validationArray: errors.array(),
    });
  } else {
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.render("auth/login", {
            pageTitle: "Login",
            path: "login",
            oldData: { email: email, password: password },
            errorMessage: "User with entered email not found",
            validationArray: [],
          });
        }
        bcryptjs.compare(password, user.password).then((doMatch) => {
          if (!doMatch) {
            return res.render("auth/login", {
              pageTitle: "Login",
              path: "login",
              oldData: { email: email, password: password },
              errorMessage: "Password is Invalid",
              validationArray: [],
            });
          } else {
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "signup",
    errorMessage: null,
    oldData: { email: "", password: "", confirmpassword: "" },
    validationArray: [],
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("auth/signup", {
      pageTitle: "Signup",
      path: "signup",
      validationArray: errors.array(),
      errorMessage: errors.array()[0].msg,
      oldData: {
        email: email,
        password: password,
        confirmpassword: confirmpassword,
      },
    });
  }

  if (password !== confirmpassword) {
    return res.render("auth/signup", {
      pageTitle: "Signup",
      path: "signup",
      validationArray: [],
      errorMessage: "Passwords should be same",
      oldData: {
        email: email,
        password: password,
        confirmpassword: confirmpassword,
      },
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.render("auth/signup", {
          pageTitle: "Signup",
          path: "signup",
          validationArray: [],
          errorMessage:
            "Account with entered email exists. Please select another email",
          oldData: {
            email: email,
            password: password,
            confirmpassword: confirmpassword,
          },
        });
      } else {
        bcryptjs
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              email: email,
              password: hashedPassword,
              cart: {
                items: [],
              },
            });
            return user.save();
          })
          .then(() => {
            res.redirect("/login");
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLogout = (req, res, next) => {
  req.session
    .destroy((err) => {
      console.log(err);
      res.redirect("/login");
    })
};
