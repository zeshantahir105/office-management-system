const authenticate = require("../middlewares/authenticate");
const {
  markAttendance,
  addAttendanceNote,
  deleteAttendanceNote,
  updateAttendanceNote,
  viewAdminAttendanceNotes,
  replyToAttendanceNotes,
} = require("./../controllers/auth.controllers");

const express = require("express");
const router = express.Router();

router.post(
  "/mark",
  authenticate,
  async (req, res, next) => await markAttendance(req, res, next)
);

router.post(
  "/add-note",
  authenticate,
  async (req, res, next) => await addAttendanceNote(req, res, next)
);

router.post(
  "/update-note",
  authenticate,
  async (req, res, next) => await updateAttendanceNote(req, res, next)
);

router.post(
  "/delete-note",
  authenticate,
  async (req, res, next) => await deleteAttendanceNote(req, res, next)
);

router.get(
  "/view-admin-notes",
  authenticate,
  async (req, res, next) => await viewAdminAttendanceNotes(req, res, next)
);

router.post(
  "/reply-to-note",
  authenticate,
  async (req, res, next) => await replyToAttendanceNotes(req, res, next)
);

module.exports = router;
