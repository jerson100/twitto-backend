const moongose = require("mongoose");

const connection = async () => {
  try {
    await moongose.connect(process.env.MONGO_URI);
    console.log("Base de datos: Activo");
  } catch (e) {
    process.exit(process.exitCode);
  }
};

module.exports = { connection };
