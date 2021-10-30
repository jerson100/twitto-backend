const UserController = require("../controllers/User.controller");
const {
  RegisteredUserException,
  ForbiddenUserException,
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
};
