const { Router: RouterExpress } = require("express");
const requestValidation = require("../middlewares/requestValidation");
const { validationSchema } = require("../middlewares/ValidationSchema");
const {
  UserCreateSchemaValidation,
} = require("../models/User/User.validation");
const UserController = require("../controllers/User.controller");
const { NotFoundUserException } = require("../models/User/User.exception");
const { generatePassword } = require("../utils/validation/password");
const { isRegisteredUser, verifyUsersType } = require("../middlewares/user");
const FollowingController = require("../controllers/Following.controller");
const { verifyUserAuthenticationToken } = require("../middlewares/token");
const { USERS_TYPE } = require("../configs/constant");
const { v2: cloudinary } = require("cloudinary");

//sistema de middleware y direccionamiento completo
const Router = RouterExpress();


Router.route("/")
  .get(
    verifyUserAuthenticationToken,
    verifyUsersType(USERS_TYPE.ADMINISTRATOR),
    async (req, res) => {
      const users = await UserController.all();
      return res.status(200).json({ data: users });
    }
  )
  .post(
    isRegisteredUser(),
    validationSchema(UserCreateSchemaValidation),
    requestValidation(async (req, res) => {
      req.body.password = await generatePassword(req.body.password);
      const newUser = await UserController.create(req.body);
      await FollowingController.setFollow(newUser._id, newUser._id);
      return res.status(201).json({ data: newUser });
    })
  );

Router.route("/:id")
    .get(
        verifyUserAuthenticationToken,
        requestValidation(async (req, res) => {
            const user = await UserController.getById(req.params.id);
            if (!user) throw new NotFoundUserException();
            return res.json({ data: user });
        })
    )
    .patch(
        verifyUserAuthenticationToken,
        requestValidation(async (req, res) => {
            const {profile_img} = req.files;
            console.log(profile_img)
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                secure: true
            });
            res.send();
        })
    )

Router.route("/:id/followers").get(
  requestValidation(async (req, res) => {
    const followers = await FollowingController.getFollowersById(req.params.id);
    return res.json({ data: followers });
  })
);

Router.route("/:id/following").get(
  requestValidation(async (req, res) => {
    const followeds = await FollowingController.getFollowedsById(req.params.id);
    return res.json({ data: followeds });
  })
);

Router.route("/:idUser/following/:idFollowedUser").delete(
  verifyUserAuthenticationToken,
  requestValidation(async (req, res) => {
    const { idUser: followerUser, idFollowedUser: followedUser } = req.params;
    await FollowingController.setUnFollow(followerUser, followedUser);
    return res.send();
  })
);

module.exports = Router;
