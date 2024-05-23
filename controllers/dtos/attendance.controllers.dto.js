const Joi = require("joi");
const {
  ViewPaginatedRecordListDTO,
} = require("../helpers/helpers.controllers.dto");

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
}).concat(ViewPaginatedRecordListDTO.extract("body"));

module.exports = {
  MarkOrUpdateAttendanceDTO,
  AddAttendanceNoteDTO,
  ViewAttendanceNotesDTO,
};
