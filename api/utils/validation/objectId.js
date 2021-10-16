const Joi = require("joi");
const validateObjectIdSchema = (paramName = "id") => {
  return Joi.object({
    [paramName]: Joi.string()
      .regex(/^[a-fA-F0-9]{24}$/)
      .required(),
  });
};

module.exports = { validateObjectIdSchema };
