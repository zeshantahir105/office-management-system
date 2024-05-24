const Joi = require("joi");

const AddAttendanceNoteDTO = Joi.object({
  body: {
    note: Joi.string().required(),
    attendanceId: Joi.number().required(),
  },
  user: {
    id: Joi.number().required(),
    roleType: Joi.string().valid("employee", "admin").required(),
  },
});

const MarkOrUpdateAttendanceDTO = Joi.object({
  body: {
    status: Joi.boolean().required(),
    dateTime: Joi.string().isoDate().required(),
  },
  user: {
    id: Joi.number().required(),
    roleType: Joi.string().valid("employee").required(),
  },
});

const ViewAttendanceNotesDTO = Joi.object({
  attendanceId: Joi.number().required(),
  getNotesOfRoleType: Joi.string().valid("employee", "admin"),
  page: Joi.number().integer().min(1),
  pageSize: Joi.number().integer().min(1).max(100),
  userId: Joi.number(),
});

module.exports = {
  MarkOrUpdateAttendanceDTO,
  AddAttendanceNoteDTO,
  ViewAttendanceNotesDTO,
};
