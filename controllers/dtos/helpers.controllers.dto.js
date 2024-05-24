const Joi = require("joi");

const ViewPaginatedRecordListDTO = Joi.object({
  body: {
    dateFrom: Joi.string().isoDate(),
    dateTo: Joi.string().isoDate(),
    page: Joi.number().integer().min(1),
    pageSize: Joi.number().integer().min(1).max(100),
    userId: Joi.number(), // this is the employee id of which the admin want to see the record
  },
  user: {
    id: Joi.number().required(),
    roleType: Joi.string().valid("employee", "admin").required(),
  },
});

module.exports = {
  ViewPaginatedRecordListDTO,
};
