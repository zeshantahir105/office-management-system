const express = require("express");
const { sequelize } = require("./models/");
const { registerUser, signInUser } = require("./controllers/auth.controllers");
const authenticate = require("./middlewares/authenticate");
const authRoutes = require("./routers/authentication");
const employeeAttendanceRoutes = require("./routers/employeeAttendance");

const app = express();
app.use(express.json());

require("dotenv").config();

// Routes
app.use("/authentication", authRoutes);
app.use("/attendance", authenticate, employeeAttendanceRoutes);

const port = 3000;

const connectDb = async () => {
  console.log("Checking database connection...");

  try {
    await sequelize.authenticate();
    console.log("Database connection established.");
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
};

(async () => {
  await connectDb();
  console.log(`Attempting to run server on post ${port}`);
  app.listen(port, () => {
    console.log(`Node API app is running on port ${port}`);
  });
})();
