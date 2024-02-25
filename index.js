const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const todos = require("./routes/todos");
const app = express();
app.use(express.json());
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
