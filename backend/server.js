const mongoose = require("mongoose");
const express = require("express");
const User = require("./schemas/userSchema.js");
const cors = require("cors");
const axiosRoute = require("./axios-routes.js");
const bodyParser = require("body-parser");
const upload = require("multer");
const app = express();
const Router = express.Router();

app.use(express.json());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use("/users", axiosRoute);

app.use(Router);

const DB =
  "mongodb+srv://Greddit_User:bkNtvDGHrBRLecaX@cluster0.mnroffh.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB Connection Successful!");
  })
  .catch((err) => {
    console.log("Error connecting to mongo:", err);
  });

const port = 4000;

app.listen(port, () => {
  console.log(`App Running at port ${port}`);
});
