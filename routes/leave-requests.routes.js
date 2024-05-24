const {
  addLeaveRequestNote,
  updateLeaveRequestNote,
  deleteLeaveRequestNote,
  viewLeaveRequestNotes,
  replyToLeaveRequestNotes,
  deleteLeaveRequest,
  createOrUpdateLeaveRequest,
  approveOrRejectLeaveRequest,
  viewLeaveRequests,
} = require("../controllers/leave-requests.controllers");
const authenticate = require("../middlewares/authenticate");

const express = require("express");

const router = express.Router();

router.post(
  "/apply",
  authenticate,
  async (req, res, next) => await createOrUpdateLeaveRequest(req, res, next)
);

router.post(
  "/delete",
  authenticate,
  async (req, res, next) => await deleteLeaveRequest(req, res, next)
);

// It will be for the admins to approve or reject the leave requests
router.post(
  "/approve-reject-leave-request",
  authenticate,
  async (req, res, next) => await approveOrRejectLeaveRequest(req, res, next)
);

router.get(
  "/view-leave-requests",
  authenticate,
  async (req, res, next) => await viewLeaveRequests(req, res, next)
);

router.post(
  "/add-note",
  authenticate,
  async (req, res, next) => await addLeaveRequestNote(req, res, next)
);

router.post(
  "/update-note",
  authenticate,
  async (req, res, next) => await updateLeaveRequestNote(req, res, next)
);

router.post(
  "/delete-note",
  authenticate,
  async (req, res, next) => await deleteLeaveRequestNote(req, res, next)
);

router.get(
  "/view-notes",
  authenticate,
  async (req, res, next) => await viewLeaveRequestNotes(req, res, next)
);

router.post(
  "/reply-to-note",
  authenticate,
  async (req, res, next) => await replyToLeaveRequestNotes(req, res, next)
);

module.exports = router;
