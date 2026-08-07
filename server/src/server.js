require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const connectDB = require("./config/db");

const userRoute = require("./routes/userRoute");

const app = express();
connectDB();

app.use(express.json());
app.use("/users", userRoute);

const PORT = process.env.PORT;
app.listen(PORT, (err) =>
  err ? console.log(err) : console.log(`Server is Running at Port ${PORT}`),
);
