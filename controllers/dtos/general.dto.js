const Joi = require("joi");

const UpdateNoteDTO = Joi.object({
  note: Joi.string().required(),
  noteId: Joi.number().required(),
});

const DeleteNoteDTO = Joi.object({
  body: {
    noteId: Joi.number().required(),
  },
  user: {
    id: Joi.number().required(),
    roleType: Joi.string().valid("employee", "admin").required(),
  },
});

const ReplyToNotesDTO = Joi.object({
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
  UpdateNoteDTO,
  DeleteNoteDTO,
  ReplyToNotesDTO,
};
