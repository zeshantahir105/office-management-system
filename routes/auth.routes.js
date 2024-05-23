const { registerUser, signInUser } = require("../controllers/auth.controllers");

const express = require("express");
const router = express.Router();

router.post("/sign-up", async (req, res, next) => {
  await registerUser(req, res, next);
  return;
});

router.get("/sign-in", async (req, res, next) => {
  await signInUser(req, res, next);
  return;
});

module.exports = router;
