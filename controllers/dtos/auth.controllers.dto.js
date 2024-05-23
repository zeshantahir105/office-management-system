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

module.exports = {
  RegisterUserDTO,
  SignInUserDTO,
};
