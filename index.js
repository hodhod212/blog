import express from "express";
const app = express();
const users = [];
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.render("index.ejs", { name: "Ali" });
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post("/login", (req, res) => {});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.post("/register", (req, res) => {
  req.body.email;
});
app.listen(5001);
