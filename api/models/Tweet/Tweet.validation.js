const Joi = require("joi");
const { REGEX } = require("../../configs/constant");

const CreateTweetSchema = Joi.object({
  user: Joi.string().regex(REGEX.OBJECT_ID).required(),
  description: Joi.string().min(1).max(300).required().trim(),
  isFijado: Joi.bool().default(false),
});

module.exports = {
  CreateTweetSchema,
};
