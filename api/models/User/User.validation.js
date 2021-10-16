const Joi = require("joi");

const UserCreateSchemaValidation = Joi.object({
  name: Joi.string().alphanum().min(6).max(20).required(),
  profile_img: Joi.string(),
  portada_img: Joi.string(),
  username: Joi.string().min(8).max(20).required(),
  password: Joi.string()
    .regex(
      /(?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.*[$@$!%*?&#.$($)$-$_])^[a-z\dA-Z[$@$!%*?&#.$($)$-$_\]]{12,20}$/
    )
    .required(),
  description: Joi.string().max(200).trim(),
  country: Joi.string().max(20).required(),
  birthday: Joi.string().required(),
  typeUser: Joi.string().valid("ADM", "US", "MOD").default("ADM"),
  email: Joi.string().email().required(),
});

module.exports = { UserCreateSchemaValidation };
