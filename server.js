const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/conn");
const authRouter = require("./routes/authRoutes");
const startupRouter = require("./routes/startupRoutes");
const officialRouter = require("./routes/officialRoutes")
const path = require("path");
const notificationRouter = require("./routes/notificationRouter");
const { populateGovernmentOfficials } = require('./db/populate');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use('/api/startups', startupRouter);
app.use('/api/officials', officialRouter);
app.use("/api/notification", notificationRouter);
app.use(express.static(path.join(__dirname, "./client/build")));
populateGovernmentOfficials();


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(port, () => {});
