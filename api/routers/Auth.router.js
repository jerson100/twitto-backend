const { Router: RouterExpress } = require("express");
const requestValidation = require("../middlewares/requestValidation");
const { validationSchema } = require("../middlewares/ValidationSchema");
const { LoginSchema, LoginException } = require("../utils/authentication/auth");
const { encode } = require("../utils/validation/jwt");
const UserController = require("../controllers/User.controller");
const { verifyPassword } = require("../utils/validation/password");

const Router = RouterExpress();

Router.post(
  "/login",
  [validationSchema(LoginSchema, "body")],
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
    });
    res.status(201).json({
      data: token,
    });
  })
);

module.exports = Router;
