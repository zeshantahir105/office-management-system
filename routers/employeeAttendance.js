const authenticate = require("../middlewares/authenticate");
const {
  markAttendance,
  addAttendanceNote,
  deleteAttendanceNote,
  updateAttendanceNote,
  viewAdminAttendanceNotes,
} = require("./../controllers/auth.controllers");

const express = require("express");
const router = express.Router();

router.post(
  "/mark",
  authenticate,
  async (req, res) => await markAttendance(req, res)
);

router.post(
  "/add-note",
  authenticate,
  async (req, res) => await addAttendanceNote(req, res)
);

router.post(
  "/update-note",
  authenticate,
  async (req, res) => await updateAttendanceNote(req, res)
);

router.post(
  "/delete-note",
  authenticate,
  async (req, res) => await deleteAttendanceNote(req, res)
);

router.get(
  "/view-admin-notes",
  authenticate,
  async (req, res) => await viewAdminAttendanceNotes(req, res)
);

module.exports = router;
