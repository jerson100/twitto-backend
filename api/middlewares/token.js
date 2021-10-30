const { UnauthorizedUserException } = require("../models/User/User.exception");
const { decoded } = require("../utils/validation/jwt");
const PREFIX = "Bearer ";

const verifyUserAuthenticationToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(
      new UnauthorizedUserException(
        "La solicitud no tiene el header 'Authorization'"
      )
    );
    return;
  }
  if (!authorization.startsWith(PREFIX)) {
    next(
      new UnauthorizedUserException("El token no tiene el formato correcto")
    );
    return;
  }
  const token = authorization.replace(PREFIX, "");
  try {
    const payload = decoded(token);
    req.us = payload;
    next();
  } catch (msg) {
    next(new UnauthorizedUserException("El token no es válido"));
  }
};

module.exports = {
  verifyUserAuthenticationToken,
};
