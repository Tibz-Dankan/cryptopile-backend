const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const imageRoutes = require("./routes/imageRoutes");
const { keepActiveController } = require("keep-apps-active");

const { memoryUsage } = require("./utils/memoryUsage");
const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(cors({ origin: process.env.PRODUCTION_URL }));
} else {
  app.use(cors());
}

app.use(express.json());

// todo routes
app.use("/", todoRoutes);
// user routes
app.use("/", userRoutes);
// admin routes
app.use("/", adminRoutes);
// image routes
app.use("/", imageRoutes);

keepActiveController(app);

// call the memory usage function here
memoryUsage();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`server started and running on port ${PORT}...`)
);
