import express from "express";
import mongoose from "mongoose";
import articleRouter from "./routes/article.js";
import Article from "./models/article.js";
import methodOverride from "method-override";
const app = express();
app.use(express.static("public"));
const users = [];
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
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRouter);
app.listen(5001);
