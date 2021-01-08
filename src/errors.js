module.exports.BadRequestError = class BadRequestError extends Error {
  constructor(message = 'Bad Request') {
    super(message);
    this.statusCode = 400;
  }
}

module.exports.UnauthorizedError = class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.statusCode = 401;
  }
}

module.exports.ForbiddenError = class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.statusCode = 403;
  }
}

module.exports.NotFoundError = class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.statusCode = 404;
  }
}
