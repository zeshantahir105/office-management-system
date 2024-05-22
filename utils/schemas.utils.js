const Joi = require("joi");

const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .required();

const passwordSchema = Joi.string()
  .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
  .required();

module.exports = {
  emailSchema,
  passwordSchema,
};
