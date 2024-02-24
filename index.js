const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const todos = require("./routes/todos");
const uri = process.env.MONGO_DB_ATLAS_URL;

(async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.info("Connected to todoDB");
  } catch (error) {
    console.error("Something went wrong", error);
  }
})();

const port = process.env.PORT || 9000;
app.use("/api/todos", cors(), todos);
app.listen(port, () => console.log(`Listening on Port ${port}`));
