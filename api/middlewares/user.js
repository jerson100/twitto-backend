const UserController = require("../controllers/User.controller");
const {
  RegisteredUserException,
  ForbiddenUserException, UpdateUserException,
} = require("../models/User/User.exception");

const isRegisteredUser = () => {
  return async (req, res, next) => {
    const user = await UserController.getUserByUsername(req.body.username);
    if (user) {
      next(new RegisteredUserException());
    } else {
      next();
    }
  };
};

/**
 * Necesita el middleware de verificación del token previamente.
 * @returns {(function(*, *, *): Promise<void>)|*}
 */
const existUser = () => {
  return async (req, res, next) => {
    const user = await UserController.getUserByUsername(req.us.username);
    if (user) {
      req.us = {
        ...req.us,
        ...user._doc
      };
      next();
    } else {
      next(new UpdateUserException());
    }
  };
}

const verifyUsersType = (...users_type) => {
  return (req, res, next) => {
    const { typeUser } = req.us;
    if (users_type.includes(typeUser)) {
      next();
    } else {
      next(new ForbiddenUserException());
    }
  };
};

module.exports = {
  isRegisteredUser,
  verifyUsersType,
  existUser
};
