const {
  registerUser,
  signInUser,
} = require("./../controllers/auth.controllers");

const express = require("express");
const router = express.Router();

router.post("/sign-up", async (req, res) => {
  await registerUser(req, res);
  return;
});

router.get("/sign-in", async (req, res) => {
  await signInUser(req, res);
  return;
});

module.exports = router;
