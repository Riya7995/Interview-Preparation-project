require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/catagoryRoute");
const interviewRoute = require("./routes/interviewRoute");
const aiRoute = require("./routes/aiRoute");
const attemptRoute = require("./routes/attemptRoute");

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoute);
app.use("/categories", categoryRoute);
app.use("/interview", interviewRoute);
app.use("/ai", aiRoute);
app.use("/attempts", attemptRoute);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const PORT = process.env.PORT;
app.listen(PORT, (err) =>
  err ? console.log(err) : console.log(`Server is Running at Port ${PORT}`),
);
