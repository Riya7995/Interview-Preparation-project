require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Connect to MongoDB
connectDB();
app.use(express.json());
const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is Running at Port ${PORT}`);
  }
});
