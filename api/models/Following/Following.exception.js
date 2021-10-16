class CreateFollowingException extends Error {
  constructor(msg = "No se pudo crear el follow", status = 400) {
    super(msg);
    (this.status = 400), (this.name = "CreateFollowingException");
  }
}

class UnFollowException extends Error {
  constructor(
    msg = "No se pudo quitar el follow a un usuario al que no se sigue",
    status = 400
  ) {
    super(msg);
    (this.status = 400), (this.name = "UnFollowException");
  }
}

module.exports = {
  CreateFollowingException,
  UnFollowException,
};
