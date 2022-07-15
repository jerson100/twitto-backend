const { Router: RouterExpress } = require("express");
const requestValidation = require("../middlewares/requestValidation");
const { schemaValidation } = require("../middlewares/ValidationSchema");
const { LoginSchema, LoginException } = require("../utils/authentication/auth");
const { encode } = require("../utils/validation/jwt");
const UserController = require("../controllers/User.controller");
const { verifyPassword } = require("../utils/validation/password");
const { verifyUserAuthenticationToken } = require("../middlewares/token");

const Router = RouterExpress();

Router.post(
  "/login",
  schemaValidation(LoginSchema, "body"),
  requestValidation(async (req, res) => {
    const { username, password } = req.body;
    //verificar si esa contraseña es la correcta...
    const us = await UserController.getUserByUsername(username);
    if (!us) {
      throw new LoginException();
    }
    const access = await verifyPassword(password, us.password);
    //generando el token de acceso al sistema...
    if (!access) {
      throw new LoginException();
    }
    const token = encode({
      username: us.username,
      _id: us._id,
      typeUser: us.typeUser,
      email: us.email,
    });
    res.status(200).json({
      data: {
        token,
        user: {
          username: us.username,
          _id: us._id,
          typeUser: us.typeUser,
          email: us.email,
        },
      },
    });
  })
);

Router.get(
  "/whoIam",
  verifyUserAuthenticationToken,
  requestValidation(async (req, res) => {
    const { us } = req;
    const token = encode({
      username: us.username,
      _id: us._id,
      typeUser: us.typeUser,
      email: us.email,
    });
    res.status(200).json({
      data: {
        user: us,
        token,
      },
    });
  })
);

module.exports = Router;
