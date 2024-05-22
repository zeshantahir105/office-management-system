const Joi = require("joi");

const { AppError } = require("./errors.utils");

const joiValidate = (DTO, object) => {
  const errors = DTO.validate(object, { abortEarly: false });

  if (!errors.error) {
    return false;
  }

  throw new AppError({ error: errors.error.details?.[0], status: 422 });
};

const validateRequest = ({ DTO, requestBody }) => {
  // filter out 'auth' object
  const { auth, ...filteredRequestBody } = requestBody;
  return joiValidate(DTO, filteredRequestBody);
};

const validateObject = ({ DTO, object }) => joiValidate(DTO, object);

const responseDTO = Joi.object({
  message: Joi.string().required().default("Success"),
  data: Joi.any().required(),
  statusCode: Joi.number().required().default(200),
});

const sendResponse = ({ object, response }) => {
  joiValidate(responseDTO, object);
  if (object.statusCode === 200) {
    return response.send(object);
  }
  return response.status(object.statusCode).send(object);
};

module.exports = {
  validateRequest,
  validateObject,
  sendResponse,
};
