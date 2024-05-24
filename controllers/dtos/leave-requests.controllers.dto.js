const Joi = require("joi");
const { ViewPaginatedRecordListDTO } = require("./helpers.controllers.dto");

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
  body: {
    note: Joi.string().required(),
    leaveRequestId: Joi.number().required(),
  },
  user: {
    id: Joi.number().required(),
    roleType: Joi.string().valid("employee", "admin").required(),
  },
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
    status: Joi.string().valid("pending", "approved", "rejected").required(),
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
