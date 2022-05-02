const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const { memoryUsage } = require("./utils/memoryUsage");
const app = express();

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

app.use(express.json());

// todo routes
app.use("/", todoRoutes);
// user routes
app.use("/", userRoutes);
// admin routes
app.use("/", adminRoutes);

// call the memory usage function here
memoryUsage();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`server started and running on port ${PORT}...`)
);
