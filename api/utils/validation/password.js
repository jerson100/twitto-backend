const bcrypt = require("bcrypt");

const generatePassword = async (name) => {
  const password = await bcrypt.hash(name, 10);
  return password;
};

module.exports = {
  generatePassword,
};
