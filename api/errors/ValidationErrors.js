class CustomError extends Error {
  constructor(message, code) {
    super('NotFoundError');
    this.statusCode = code;
    this.msg = message;
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message, 400);
  }
}

class ConflictError extends CustomError {
  constructor(message) {
    super(message, 422);
  }
}

module.exports = {
  NotFoundError,
  ConflictError,
};
