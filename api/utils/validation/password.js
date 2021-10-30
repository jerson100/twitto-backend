const bcrypt = require("bcrypt");

const generatePassword = async (name) => {
  const password = await bcrypt.hash(name, 10);
  return password;
};

const verifyPassword = async (txt, hash) => {
  return await bcrypt.compare(txt, hash);
};

module.exports = {
  generatePassword,
  verifyPassword,
};
