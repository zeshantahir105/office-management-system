const express = require("express");
const app = express();

const { sequelize } = require("./sequelize/models/");
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

// routes

app.get("/", (req, res) => {
  res.send("HELLO NODE API :)");
});

(async () => {
  await connectDb();

  console.log(`Attempting to run server on post ${port}`);
  app.listen(port, () => {
    console.log(`Node API app is running on port ${port}`);
  });
})();
