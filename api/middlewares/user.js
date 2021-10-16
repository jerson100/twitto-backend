const UserController = require("../controllers/User.controller");
const { RegisteredUserException } = require("../models/User/User.exception");

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

module.exports = {
  isRegisteredUser,
};
