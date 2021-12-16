const User = require("./models/user");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoutes = require("./routes/404");
const authRoutes = require("./routes/auth");

const helmet = require("helmet");
const compression = require("compression");

const multer = require("multer");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const mongoose = require("mongoose");

const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Math.random() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.eplmt.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(helmet());
app.use(compression());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "mysecret",
    resave: "false",
    saveUninitialized: "false",
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.get("/favicon.ico", (req, res, next) => {
  res.status(402);
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
