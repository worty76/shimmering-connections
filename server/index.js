const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const userRouter = require("./src/routers/userRouter");
const productRouter = require("./src/routers/productRouter");

var corsOptions = {
  origin: "http://localhost:8081",
  credentials: true,
  optionSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "src", "controllers", "uploads"))
);

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Worty's server");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
