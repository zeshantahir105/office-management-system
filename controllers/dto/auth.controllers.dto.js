const Joi = require("joi");

const { emailSchema, passwordSchema } = require("../../utils/schemas.utils");
const RegisterUserDTO = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  email: emailSchema,

  password: passwordSchema,

  age: Joi.number().integer().min(5).max(150).required(),

  roleType: Joi.string().valid("admin", "employee").required(),
});

const SignInUserDTO = Joi.object({
  email: emailSchema,
  password: Joi.string().required(),
});

const MarkAttendanceDTO = Joi.object({
  body: {
    status: Joi.boolean().required(),
    dateTime: Joi.string().isoDate().required(),
  },
  user: {
    id: Joi.number().required(),
    roleType: Joi.string().valid("employee").required(),
  },
});

const AddAttendanceNoteDTO = Joi.object({
  note: Joi.string().required(),
  attendanceId: Joi.number().required(),
  commenterId: Joi.number().required(),
});

const UpdateAttendanceNoteDTO = Joi.object({
  note: Joi.string().required(),
  noteId: Joi.number().required(),
});

const DeleteAttendanceNoteDTO = Joi.object({
  body: {
    noteId: Joi.number().required(),
  },
  user: {
    id: Joi.number().required(),
    roleType: Joi.string().valid("employee", "admin").required(),
  },
});

const ViewAdminAttendanceNotesDTO = Joi.object({
  attendanceId: Joi.number().required(),
  page: Joi.number().integer().min(1),
  pageSize: Joi.number().integer().min(1).max(100),
});

const ReplyToAttendanceNotesDTO = Joi.object({
  body: {
    noteId: Joi.number().required(),
    note: Joi.string().required(),
  },
  user: {
    id: Joi.number().required(),
    roleType: Joi.string().valid("employee", "admin").required(),
  },
});

module.exports = {
  RegisterUserDTO,
  SignInUserDTO,
  MarkAttendanceDTO,
  AddAttendanceNoteDTO,
  UpdateAttendanceNoteDTO,
  DeleteAttendanceNoteDTO,
  ViewAdminAttendanceNotesDTO,
  ReplyToAttendanceNotesDTO,
};
