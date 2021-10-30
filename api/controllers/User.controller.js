const { User } = require("../models/User/User.model");

const create = async (us) => {
  const newUser = await new User(us);
  await newUser.save();
  return newUser;
};

const updateMany = async () => {
  return await User.updateMany(id, {
    $set: us,
  });
};
const updateOne = async (id, us) => {
  return await User.findByIdAndUpdate(id, {
    $set: us,
  });
};

const all = async () => {
  return await User.find({}, { password: 0, __v: 0, updatedAt: 0 });
};

const getById = async (id) => {
  return await User.findById(id, { password: 0, __v: 0, updatedAt: 0 });
};

const getUserByUsername = async (username) => {
  return await User.findOne({ username: username });
};

// const findUserBy = async () => {};

module.exports = {
  create,
  updateOne,
  updateMany,
  all,
  getById,
  getUserByUsername,
};
