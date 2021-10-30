const Joi = require("joi");
const { REGEX } = require("../../configs/constant");

class LoginException extends Error {
  constructor(msg = "Usuario o contraseña incorrectos", status = 401) {
    super(msg);
    this.status = status;
    this.name = "LoginException";
  }
}

const LoginSchema = Joi.object({
  username: Joi.string().regex(REGEX.user.username).required(),
  password: Joi.string().regex(REGEX.user.password).required(),
});

module.exports = {
  LoginSchema,
  LoginException,
};
