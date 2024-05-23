const Joi = require("joi");
const {
  ViewPaginatedRecordListDTO,
} = require("../helpers/helpers.controllers.dto");

const CreateOrUpdateLeaveRequestDTO = Joi.object({
  body: {
    dateFrom: Joi.date().required(),
    dateTo: Joi.date().required(),
  },
  user: {
    id: Joi.number().required(),
    roleType: Joi.string().valid("employee").required(),
  },
});

const AddLeaveRequestNoteDTO = Joi.object({
  note: Joi.string().required(),
  leaveRequestId: Joi.number().required(),
  commenterId: Joi.number().required(),
});

const ViewLeaveRequestNotesDTO = Joi.object({
  leaveRequestId: Joi.number().required(),
  getNotesOfRoleType: Joi.string().valid("employee", "admin"),
  ...ViewPaginatedRecordListDTO.body,
});

const DeleteLeaveRequestDTO = Joi.object({
  body: {
    leaveRequestId: Joi.number().required(),
  },
  user: {
    id: Joi.number().required(),
    roleType: Joi.string().valid("employee").required(),
  },
});

const ApproveOrRejectLeaveRequestDTO = Joi.object({
  body: {
    leaveRequestId: Joi.number().required(),
  },
  user: {
    id: Joi.number().required(),
    roleType: Joi.string().valid("admin").required(),
  },
});

module.exports = {
  CreateOrUpdateLeaveRequestDTO,
  AddLeaveRequestNoteDTO,
  ViewLeaveRequestNotesDTO,
  DeleteLeaveRequestDTO,
  ApproveOrRejectLeaveRequestDTO,
};
