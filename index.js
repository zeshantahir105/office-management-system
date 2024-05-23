const express = require("express");
const { sequelize } = require("./models/");
const authenticate = require("./middlewares/authenticate");

const authRoutes = require("./routes/auth.routes");
const employeeAttendanceRoutes = require("./routes/employee-attendance.routes");
const leaveRequestRoutes = require("./routes/leave-requests.routes");

const app = express();
app.use(express.json());

require("dotenv").config();

// Routes
app.use("/authentication", authRoutes);
app.use("/attendance", authenticate, employeeAttendanceRoutes);
app.use("/leave-requests/", authenticate, leaveRequestRoutes);

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
