class CreateTweetException extends Error {
  constructor(msg = "No se pudo crear el tweet", status = 400) {
    super(msg);
    this.status = status;
    this.name = "CreateTweetException";
  }
}

class FindTweetByIdException extends Error {
  constructor(msg = "No se encontró el tweet", status = 404) {
    super(msg);
    this.status = status;
    this.name = "FindTweetByIdException";
  }
}

module.exports = {
  CreateTweetException,
  FindTweetByIdException,
};
