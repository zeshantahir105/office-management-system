const authenticate = require("../middlewares/authenticate");
const {
  markOrUpdateAttendace,
  addAttendanceNote,
  deleteAttendanceNote,
  updateAttendanceNote,
  replyToAttendanceNotes,
  viewAttendanceNotes,
} = require("../controllers/attendance.controllers");

const express = require("express");
const {
  viewPaginatedRecordList,
} = require("../controllers/helpers/helpers.controllers");

const router = express.Router();

router.post(
  "/mark",
  authenticate,
  async (req, res, next) => await markOrUpdateAttendace(req, res, next)
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
  "/view-employee-attendance",
  authenticate,
  async (req, res, next) =>
    await viewPaginatedRecordList({
      req,
      res,
      next,
      tableName: "attendance",
    })
);

// it can fetch the all notes against the attendance also, by the user role type
router.get(
  "/view-notes",
  authenticate,
  async (req, res, next) => await viewAttendanceNotes(req, res, next)
);

router.post(
  "/reply-to-note",
  authenticate,
  async (req, res, next) => await replyToAttendanceNotes(req, res, next)
);

module.exports = router;
