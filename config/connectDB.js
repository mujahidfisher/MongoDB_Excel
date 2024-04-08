const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MongoDB_URL)
  .then(() => {
    console.log("DB Connected🐱‍🐉");
  })
  .catch((err) => {
    console.log("error connecting to mongodb :", err);
  });