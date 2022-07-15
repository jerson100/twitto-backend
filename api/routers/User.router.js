const { Router: RouterExpress } = require("express");
const requestValidation = require("../middlewares/requestValidation");
const { validationSchema } = require("../middlewares/ValidationSchema");
const {
  UserCreateSchemaValidation, UserPatchSchema,
} = require("../models/User/User.validation");
const UserController = require("../controllers/User.controller");
const { NotFoundUserException, UserUpdateException } = require("../models/User/User.exception");
const { generatePassword } = require("../utils/validation/password");
const { isRegisteredUser, verifyUsersType, existUser} = require("../middlewares/user");
const FollowingController = require("../controllers/Following.controller");
const { verifyUserAuthenticationToken } = require("../middlewares/token");
const { USERS_TYPE } = require("../configs/constant");
const fileUpload = require("express-fileupload");
const {configFileUpload} = require("../configs/fileupload");
const {uploadFileCloudinary, deleteFileCloduinary} = require("../configs/cloudinary");
const fs = require("fs-extra");

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
  )
    .patch(
        verifyUserAuthenticationToken,
        existUser(),
        fileUpload(configFileUpload),
        validationSchema(UserPatchSchema, "body", (req) => {
            if(req.files.profile_img) fs.unlink(req.files.profile_img.tempFilePath);
        }),
        requestValidation(async (req, res) => {
            const obj = {...req.us, ...req.body}
            if(req.files?.profile_img){
                try{
                    const { public_id, secure_url } = await uploadFileCloudinary(req.files.profile_img.tempFilePath);
                    //remove the previous image of cloudinary
                    if(obj.profile_img.public_id && public_id){
                        try {
                            await deleteFileCloduinary(obj.profile_img.public_id);
                        }catch(e){console.log(e)}
                    }
                    obj.profile_img = { public_id,secure_url }
                }catch(e){
                    throw new UserUpdateException("Usuario no actualizado, no se logró almacenar la imagen");
                }finally{
                    await fs.unlink(req.files.profile_img.tempFilePath);
                }
            }
            const updatedUser = await UserController.updateOne(obj._id, obj)
            res.status(200).json( {
                data: {
                    _id: updatedUser._id,name: updatedUser.name,
                    username:updatedUser.username,email:updatedUser.email,
                    typeUser:updatedUser.typeUser,country:updatedUser.country,
                    birthday: updatedUser.birthday,profile_img:updatedUser.profile_img,
                    createdAt:updatedUser.createdAt,updatedAt:updatedUser.updatedAt,
                }
            } );
        })
    )

Router.route("/:id")
    .get(
        verifyUserAuthenticationToken,
        requestValidation(async (req, res) => {
            const user = await UserController.getById(req.params.id);
            if (!user) throw new NotFoundUserException();
            return res.json({ data: user });
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
