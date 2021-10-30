const Joi = require("joi");
const { REGEX } = require("../../configs/constant");

const UserCreateSchemaValidation = Joi.object({
  name: Joi.string().alphanum().min(6).max(20).required(),
  profile_img: Joi.string(),
  portada_img: Joi.string(),
  username: Joi.string().min(8).max(20).required(),
  password: Joi.string().regex(REGEX.user.password).required(),
  description: Joi.string().max(200).trim(),
  country: Joi.string().max(20).required(),
  birthday: Joi.string().required(),
  typeUser: Joi.string().valid("ADM", "US", "MOD").default("ADM"),
  email: Joi.string().email().required(),
});

module.exports = { UserCreateSchemaValidation };
