import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import axios from "axios";

import mongoose from "mongoose";
import articleRouter from "./routes/article.js";
import Article from "./models/article.js";

import express from "express";
const app = express();
import bcrypt from "bcrypt";
import flash from "express-flash";
import session from "express-session";
import passport from "passport";
import methodOverride from "method-override";
import initializePassport from "./passport-config.js";
const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1:27017/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected To Mongo Db DataBase");
  })
  .catch((err) => {
    console.log("DataBase Connection Error " + err);
  });
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);
app.use(express.static("public"));

const users = [];
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.post("/weather", (req, res) => {
  const url = `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${req.body.latitude},${req.body.longitude}?units=auto`;
  axios({
    url: url,
    responseType: "json",
  }).then((data) => res.json(data.data.currently));
});
app.get("/", checkAuthenticated, async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index.ejs", { name: req.user.name, articles: articles });
});
app.use("/articles", articleRouter);
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});
app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});
app.post("/register", checkNotAuthenticated, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10); //10:number of password letters
  users.push({
    id: Date.now().toString(),
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  res.redirect("/login");
  try {
  } catch {
    res.redirect("/register");
  }
  console.log(users);
});
app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(5002);
